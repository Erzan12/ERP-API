export enum Gender {
  MALE   = 'male',
  FEMALE = 'female',
}

export enum CivilStatus {
  SINGLE    = 'single',
  MARRIED   = 'married',
  SEPARATED = 'separated',
  WIDOWED   = 'widowed',
}

export enum StatusEnum {
  ACTIVE   = 'active',
  INACTIVE = 'inactive',
}

export enum CareerPostingStatus {
  ALL       = 'all',
  DRAFT     = 'draft',
  SUBMITTED = 'submitted',
  VERIFIED  = 'verified',
  APPROVED  = 'approved',
  REJECTED  = 'rejected',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
}

export enum EmployeeType {
  LAND_BASED = 'land_based',
  SEA_BASED = 'sea_based',
}

export enum ApplicationSource {
  COMPANY_WEBSITE = 'company_website',
  WALK_IN         = 'walk_in',
  REFERRAL        = 'referral',
  LINKEDIN        = 'linkedIn',
  JOBSTREET       = 'jobstreet',
}

export enum ApplicationStatus {
  APPLIED       = 'applied',
  SCREENING     = 'screening',
  SHORTLISTED   = 'shortlisted',
  FOR_INTERVIEW = 'for_interview',
  ACCEPTED      = 'accepted',
  REJECTED      = 'rejected',
  ONBOARDING    = 'onboarding',
}

export enum InterviewStage {
  INITIAL = 'initial',
  SECOND  = 'second',
  FINAL   = 'final',
}

export enum EvaluationStage {
  THIRD_MONTH_EVALUATION = 'third_month_evaluation',
  FIFTH_MONTH_EVALUATION = 'fifth_month_evaluation',
}

export enum EvaluationStatus {
  FOR_EVALUATION     = 'for_evaluation',
  FOR_VERIFICATION   = 'for_verification',
  FOR_APPROVAL       = 'for_approval',
  FOR_ACKNOWLEDGMENT = 'for_acknowledgment'
}

export enum EvaluationStageStatus {
  PENDING  = 'pending',
  OVERDUE  = 'overdue',
  COMPLETE = 'complete'
}
