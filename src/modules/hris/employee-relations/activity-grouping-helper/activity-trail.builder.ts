import { HrErCaseStage } from '@prisma/client';
import {
  ACTION_LABEL,
  ACTION_STAGE_MAP,
  STAGE_LABEL,
  STAGE_ORDER,
} from './activity-log.constants';

type TrailEntry = {
  id: string;
  action: string;
  label: string;
  stage: HrErCaseStage | null;
  actor_id: string;
  party_id: string | null;
  occurred_at: Date;
  metadata: unknown;
};

type TrailStage = {
  stage: HrErCaseStage;
  label: string;
  sequence: number;
  status: 'completed' | 'in_progress' | 'pending';
  sla_days: number | null;
  entered_at: Date | null;
  exited_at: Date | null;
  days_in_stage: number | null;
  entry_count: number;
  entries: TrailEntry[];
};

/**
 * Shape required by buildActivityTrail().
 *
 * This intentionally describes only the fields consumed by this helper.
 * It can therefore be used with Prisma results without making the whole
 * Prisma model part of this function's public contract.
 */
type ActivityTrailLog = {
  id: string;
  action: string;
  stage: HrErCaseStage | null;
  actor_id: string;
  party_id: string | null;
  occurred_at: Date;
  metadata: unknown;
};

type ActivityTrailStageLog = {
  stage: HrErCaseStage;
  sla_days: number;
  entered_at: Date;
  exited_at: Date | null;
};

type ActivityTrailParty = {
  id: string;
  role: string;
  stage: HrErCaseStage | null;
  stage_logs: ActivityTrailStageLog[];
  employee: {
    person: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  } | null;
};

type ActivityTrailCase = {
  stage: HrErCaseStage;
  activity_logs: ActivityTrailLog[];
  parties: ActivityTrailParty[];
};

export function buildActivityTrail(disciplinaryCase: ActivityTrailCase): {
  stages: TrailStage[];
  // unassigned: TrailEntry[];
  // parties: Array<{
  //   id: string;
  //   role: string;
  //   stage: HrErCaseStage | null;
  //   name: string;
  // }>;
} {
  const logs = disciplinaryCase.activity_logs;
  const parties = disciplinaryCase.parties;

  // const partyMap = new Map(
  //   parties.map((party) => [
  //     party.id,
  //     {
  //       id: party.id,
  //       role: party.role,
  //       stage: party.stage,
  //       name: [
  //         party.employee?.person?.first_name,
  //         party.employee?.person?.last_name,
  //       ]
  //         .filter((name): name is string => Boolean(name))
  //         .join(' '),
  //     },
  //   ]),
  // );

  // Stage log per (party, stage).
  // Keep the earliest entry and its corresponding exit.
  const stageLogIndex = new Map<string, ActivityTrailStageLog>();

  for (const party of parties) {
    for (const stageLog of party.stage_logs) {
      const key = `${party.id}:${stageLog.stage}`;
      const previous = stageLogIndex.get(key);

      if (
        !previous ||
        stageLog.entered_at.getTime() < previous.entered_at.getTime()
      ) {
        stageLogIndex.set(key, stageLog);
      }
    }
  }

  const buckets = new Map<HrErCaseStage, TrailEntry[]>();
  const unassigned: TrailEntry[] = [];

  for (const log of logs) {
    const stage: HrErCaseStage | undefined =
      log.stage ?? ACTION_STAGE_MAP[log.action];

    const entry: TrailEntry = {
      id: log.id,
      action: log.action,
      label: ACTION_LABEL[log.action] ?? log.action.replace(/_/g, ' '),
      stage: log.stage,
      actor_id: log.actor_id,
      party_id: log.party_id,
      occurred_at: log.occurred_at,
      metadata: log.metadata,
    };

    if (!stage) {
      unassigned.push(entry);
      continue;
    }

    const existing = buckets.get(stage);

    if (existing) {
      existing.push(entry);
    } else {
      buckets.set(stage, [entry]);
    }
  }

  const currentIndex = STAGE_ORDER.indexOf(disciplinaryCase.stage);

  const stages: TrailStage[] = STAGE_ORDER.map((stage, index) => {
    const entries = [...(buckets.get(stage) ?? [])].sort(
      (a, b) => a.occurred_at.getTime() - b.occurred_at.getTime(),
    );

    // Aggregate stage timing across respondents.
    const relevant = parties
      .filter((party) => party.role === 'respondent')
      .map((party) => stageLogIndex.get(`${party.id}:${stage}`))
      .filter(
        (stageLog): stageLog is ActivityTrailStageLog => stageLog !== undefined,
      );

    const entered_at = relevant.length
      ? new Date(
          Math.min(
            ...relevant.map((stageLog) => stageLog.entered_at.getTime()),
          ),
        )
      : null;

    const allExited =
      relevant.length > 0 &&
      relevant.every((stageLog) => stageLog.exited_at !== null);

    const exited_at = allExited
      ? new Date(
          Math.max(
            ...relevant.map((stageLog) => stageLog.exited_at!.getTime()),
          ),
        )
      : null;

    return {
      stage,
      label: STAGE_LABEL[stage],
      sequence: index + 1,
      status:
        index < currentIndex
          ? 'completed'
          : index === currentIndex
            ? 'in_progress'
            : 'pending',
      sla_days: relevant[0]?.sla_days ?? null,
      entered_at,
      exited_at,
      days_in_stage: entered_at
        ? Math.floor(
            ((exited_at ?? new Date()).getTime() - entered_at.getTime()) /
              86_400_000,
          )
        : null,
      entry_count: entries.length,
      entries,
    };
  });

  return {
    stages,
    // unassigned,
    // parties: [...partyMap.values()],
  };
}
