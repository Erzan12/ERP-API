import { InterviewStage } from '@prisma/client';
export declare class ExaminationRatingDto {
    exam_name: string;
    result: string;
    remarks: string;
}
export declare class AssessInterviewDto {
    interviewer_id: string;
    remarks: string;
    stage: InterviewStage;
    total_points: number;
    recommendations: string;
    ratings: ExaminationRatingDto[];
}
