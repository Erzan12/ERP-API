import { HrErCaseStage } from "@prisma/client";

export const STAGE_ORDER: HrErCaseStage[] = [
    HrErCaseStage.notice_to_explain,
    HrErCaseStage.written_explanation,
    HrErCaseStage.administrative_hearing,
    HrErCaseStage.notice_of_decision,
    HrErCaseStage.case_closed,
];

export const SLA_DAYS: Record<HrErCaseStage, number> = {
    [HrErCaseStage.notice_to_explain]: 10,
    [HrErCaseStage.written_explanation]: 5,
    [HrErCaseStage.administrative_hearing]: 7,
    [HrErCaseStage.notice_of_decision]: 3,
    [HrErCaseStage.case_closed]: 0,
};