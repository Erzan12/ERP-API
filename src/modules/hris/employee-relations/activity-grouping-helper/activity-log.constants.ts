import { HrErCaseStage } from "@prisma/client";

export const ACTION_STAGE_MAP: Record<string, HrErCaseStage> = {
  nte_created: HrErCaseStage.notice_to_explain,
  nte_revised: HrErCaseStage.notice_to_explain,
  nte_review_approved: HrErCaseStage.notice_to_explain,
  nte_review_rejected: HrErCaseStage.notice_to_explain,
  nte_issued: HrErCaseStage.notice_to_explain,
  nte_acknowledged: HrErCaseStage.notice_to_explain,

  written_explanation_entered: HrErCaseStage.written_explanation,
  written_explanation_received: HrErCaseStage.written_explanation,
  written_explanation_waived: HrErCaseStage.written_explanation,

  administrative_hearing_entered: HrErCaseStage.administrative_hearing,
  hearing_scheduled: HrErCaseStage.administrative_hearing,
  hearing_rescheduled: HrErCaseStage.administrative_hearing,
  hearing_conducted: HrErCaseStage.administrative_hearing,
  hearing_waived: HrErCaseStage.administrative_hearing,
  minutes_uploaded: HrErCaseStage.administrative_hearing,

  notice_of_decision_entered: HrErCaseStage.notice_of_decision,
  decision_created: HrErCaseStage.notice_of_decision,
  decision_review_approved: HrErCaseStage.notice_of_decision,
  decision_issued: HrErCaseStage.notice_of_decision,

  case_closed: HrErCaseStage.case_closed,
};

export const STAGE_ORDER: HrErCaseStage[] = [
  HrErCaseStage.notice_to_explain,
  HrErCaseStage.written_explanation,
  HrErCaseStage.administrative_hearing,
  HrErCaseStage.notice_of_decision,
  HrErCaseStage.case_closed,
];

export const STAGE_LABEL: Record<HrErCaseStage, string> = {
  notice_to_explain: 'Notice to Explain',
  written_explanation: 'Written Explanation',
  administrative_hearing: 'Administrative Hearing',
  notice_of_decision: 'Notice of Decision',
  case_closed: 'Case Closed',
};

export const ACTION_LABEL: Record<string, string> = {
  nte_created: 'NTE drafted',
  nte_revised: 'NTE revised',
  nte_review_approved: 'NTE review approved',
  nte_issued: 'Notice to Explain issued',
  written_explanation_entered: 'Entered written explanation stage',
  written_explanation_received: 'Written explanation received',
  administrative_hearing_entered: 'Entered administrative hearing stage',
  hearing_scheduled: 'Hearing scheduled',
  hearing_rescheduled: 'Hearing rescheduled',
  hearing_conducted: 'Hearing conducted',
};