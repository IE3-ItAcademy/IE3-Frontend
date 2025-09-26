export interface EmployeesDTO {
  id: number;
  name: string;
  roles: string[];
  activeContract: boolean;
  projectInfoList: ProjectInfoDTO[];
}

interface ProjectInfoDTO {
  name: string;
  status: string;
}
