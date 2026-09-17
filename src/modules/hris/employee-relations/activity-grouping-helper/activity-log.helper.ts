import { HrErCaseStage, Prisma } from '@prisma/client';
import { ACTION_STAGE_MAP } from './activity-log.constants';

export type LogInput = {
  case_id: string;
  party_id?: string | null;
  actor_id: string;
  stage?: HrErCaseStage | null;
  action: string;
  metadata?: Prisma.InputJsonValue;
};

export async function logActivity(tx: Prisma.TransactionClient, input: LogInput) {
  return tx.hrErCaseActivityLog.create({
    data: {
      case_id: input.case_id,
      party_id: input.party_id ?? null,
      actor_id: input.actor_id,
      stage: input.stage ?? ACTION_STAGE_MAP[input.action] ?? null,
      action: input.action,
      metadata: input.metadata ?? Prisma.JsonNull,
    },
  });
}