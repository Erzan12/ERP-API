import { DashboardService } from './dashboard.service';
export declare class DashboardControllerV2 {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getHrDashboard(): Promise<{
        status: string;
        message: string;
        data: {
            total_active_employees: number;
            total_inactive_employees: number;
            total_separated_employees: number;
            for_regularization_employee: number;
            employees_due_for_awol: string;
            overly_extended_crew_transfer: string;
        };
    }>;
}
