export interface ContractDTO {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: boolean;
    wageByHour: number;
    weeklyHours: string;
    roles: string[];
}