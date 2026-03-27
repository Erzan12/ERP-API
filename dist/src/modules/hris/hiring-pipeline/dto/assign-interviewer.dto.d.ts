import { InterviewStage } from 'src/utils/decorators/global.enums.decorator';
export declare class AssignInterviewerDto {
    employee_id: string;
    applicant_id: string;
    interview_stage: InterviewStage;
    date_of_interview: string;
    remarks: string;
    total_points: number;
    recommendation: string;
}
