import { useEffect, useState } from "react";
import "./home.scss"
import { PieChart } from '@mui/x-charts/PieChart';
import type { ProjectByStatusDTO } from "../../models/ProjectByStatusDTO";
import type { ProjectDTO } from "../../models/ProjectDTO";
import { statusClassMap, statusMap } from "../../constants/statusMap";
import type { EmployeesDTO } from "../../models/EmployeesDTO";
import type { employeeCountByRolesDTO } from "../../models/employeeCountByRolesDTO";

export default function Home() {
    const [projectByStatus, setProjectByStatus] = useState<ProjectByStatusDTO>()
    const [graphData, setGraphData] = useState<any[]>([])
    const [projects, setProjects] = useState<ProjectDTO[]>([])
    const [employees, setEmployees] = useState<EmployeesDTO[]>([])
    const [employeeByRole, setEmployeeByRole] = useState<employeeCountByRolesDTO>()
    const [employeeGraphData, setEmployeeGraphData] = useState<any[]>([])

    useEffect(() => {
        const fetchProjectsData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/projects/countByStatus");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                setProjectByStatus(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchProjectsData()
    }, [])

    useEffect(() => {
        const fetchProjectsData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/projects");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                console.table(result)
                setProjects(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchProjectsData()
    }, [])

    useEffect(() => {
        const fetchEmployeesGraphData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/employees/countByRoles");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                console.table(result)
                setEmployeeByRole(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchEmployeesGraphData()
    }, [])

    useEffect(() => {

        const fetchEmployeesData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/employees");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                setEmployees(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchEmployeesData()

    }, [employees])

    useEffect(() => {
        if (projectByStatus) {
            const statusColors: Record<string, string> = {
                completedProjectCount: "#0d8c29",
                plannedProjectCount: "#f2b35c",
                availableProjectCount: "#1078a5",
                unavailableProjectCount: "#f25f5c",
                finishedProjectCount: "#50514f",
            };

            const data = [
                { id: 0, value: projectByStatus.completedProjectCount, label: "Concluído", color: statusColors.completedProjectCount },
                { id: 1, value: projectByStatus.plannedProjectCount, label: "Planejado", color: statusColors.plannedProjectCount },
                { id: 2, value: projectByStatus.unavailableProjectCount, label: "Inválido", color: statusColors.unavailableProjectCount },
                { id: 3, value: projectByStatus.availableProjectCount, label: "Ativo", color: statusColors.availableProjectCount },
                { id: 4, value: projectByStatus.finishedProjectCount, label: "Inconcluído", color: statusColors.finishedProjectCount },
            ];
            setGraphData(data);
        }
    }, [projectByStatus]);

    useEffect(() => {
        if (employeeByRole) {
            const statusColors: Record<string, string> = {
                managerCount: "#f2b35c",
                devCount: "#1078a5",
                qaCount: "#0d8c29",
                securityCount: "#f25f5c",
            };

            const data = [
                { id: 0, value: employeeByRole.managerCount, label: "Manager", color: statusColors.managerCount },
                { id: 1, value: employeeByRole.devCount, label: "Dev", color: statusColors.devCount },
                { id: 2, value: employeeByRole.qaCount, label: "QA", color: statusColors.qaCount },
                { id: 3, value: employeeByRole.securityCount, label: "Security", color: statusColors.securityCount },
            ];
            setEmployeeGraphData(data);
        }
    }, [projectByStatus]);

    return (
        <div className="home-container">
            <div className="column-left">
                <div className="home-graph-container">
                        <label className="home-title">Estatísticas</label>
                    <div className="graphs-container">
                        <div className="graphs">
                            <p>Projetos: {projectByStatus?.totalProjectCount}</p>
                            <PieChart
                                series={[
                                    {
                                        data: graphData, innerRadius: 50, outerRadius: 100,
                                    },
                                ]}
                                width={200}
                                height={200}
                            />
                        </div>
                        <div>
                            <div className="graphs">
                                <p>Funcionários ativos: {employeeByRole?.totalEmployeeCountWithActiveContracts}</p>

                                <PieChart
                                    series={[
                                        {
                                            data: employeeGraphData, innerRadius: 50, outerRadius: 100,
                                        },
                                    ]}
                                    width={200}
                                    height={200}
                                />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="home-projects-container">
                    <label className="home-title">Projetos</label>
                    <div className="home-projects-list">
                        {
                            projects.map((e) =>
                                <div key={e.id} className="home-projects">
                                    <div>
                                        {e.name}
                                    </div>
                                    <div className="project-status">
                                        <div className={`status ${statusClassMap[e.status]}`}>{statusMap[e.status]}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="column-right">
                <div className="home-employees-container">
                    <label className="home-title">Funcionários</label>
                    <div className="home-employees-list">
                        {
                            employees.map((e) =>
                                <div key={e.id} className="home-employees">
                                    <div>
                                        {e.name}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="suriberto-home" />
            </div>
        </div>
    );
}