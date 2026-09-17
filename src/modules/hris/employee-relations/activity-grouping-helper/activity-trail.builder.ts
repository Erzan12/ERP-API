import { HrErCaseStage } from "@prisma/client";
import { ACTION_LABEL, ACTION_STAGE_MAP, STAGE_LABEL, STAGE_ORDER } from "./activity-log.constants";

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

export function buildActivityTrail(disciplinaryCase: any) {
  const logs = disciplinaryCase.activity_logs ?? [];
  const parties = disciplinaryCase.parties ?? [];

  const partyMap = new Map(
    parties.map((p: any) => [
      p.id,
      {
        id: p.id,
        role: p.role,
        stage: p.stage,
        name: [p.employee?.person?.first_name, p.employee?.person?.last_name]
          .filter(Boolean)
          .join(' '),
      },
    ]),
  );

  // stage log per (party, stage) - take the earliest entry / latest exit
  const stageLogIndex = new Map<string, { sla_days: number; entered_at: Date; exited_at: Date | null }>();
  for (const p of parties) {
    for (const sl of p.stage_logs ?? []) {
      const key = `${p.id}:${sl.stage}`;
      const prev = stageLogIndex.get(key);
      if (!prev || sl.entered_at < prev.entered_at) stageLogIndex.set(key, sl);
    }
  }

  const buckets = new Map<HrErCaseStage, TrailEntry[]>();
  const unassigned: TrailEntry[] = [];

  for (const log of logs) {
    const stage: HrErCaseStage | undefined = log.stage ?? ACTION_STAGE_MAP[log.action];
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
    if (!stage) { unassigned.push(entry); continue; }
    if (!buckets.has(stage)) buckets.set(stage, []);
    buckets.get(stage)!.push(entry);
  }

  const currentIndex = STAGE_ORDER.indexOf(disciplinaryCase.stage);

  const stages: TrailStage[] = STAGE_ORDER.map((stage, i) => {
    const entries = (buckets.get(stage) ?? []).sort(
      (a, b) => +new Date(a.occurred_at) - +new Date(b.occurred_at),
    );

    // aggregate stage timing across respondents
    const relevant = parties
      .filter((p: any) => p.role === 'respondent')
      .map((p: any) => stageLogIndex.get(`${p.id}:${stage}`))
      .filter(Boolean) as any[];

    const entered_at = relevant.length
      ? new Date(Math.min(...relevant.map((r) => +new Date(r.entered_at))))
      : null;
    const allExited = relevant.length > 0 && relevant.every((r) => r.exited_at);
    const exited_at = allExited
      ? new Date(Math.max(...relevant.map((r) => +new Date(r.exited_at))))
      : null;

    return {
      stage,
      label: STAGE_LABEL[stage],
      sequence: i + 1,
      status: i < currentIndex ? 'completed' : i === currentIndex ? 'in_progress' : 'pending',
      sla_days: relevant[0]?.sla_days ?? null,
      entered_at,
      exited_at,
      days_in_stage: entered_at
        ? Math.floor((+(exited_at ?? new Date()) - +entered_at) / 86_400_000)
        : null,
      entry_count: entries.length,
      entries,
    };
  });

  return { stages, unassigned, parties: [...partyMap.values()] };
}