export interface ProjectDTO {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    status: string;
    costs: {
        totalCost: number;
        totalCostPerPeriod: number;
    };
    employees: Employee[];
}

interface Employee {
    id: number;
    name: string;
    role: string[];
}