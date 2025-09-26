import { useEffect, useState } from "react";
import "./home.scss"
import { PieChart } from '@mui/x-charts/PieChart';
import type { ProjectByStatusDTO } from "../../models/ProjectByStatusDTO";
import type { ProjectDTO } from "../../models/ProjectDTO";
import { statusClassMap, statusMap } from "../../constants/statusMap";

export default function Home() {
    const [projectByStatus, setProjectByStatus] = useState<ProjectByStatusDTO>()
    const [graphData, setGraphData] = useState<any[]>([])
    const [projects, setProjects] = useState<ProjectDTO[]>([])
    const [employees, setEmployees] = useState<any[]>([])

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

                setProjects(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchProjectsData()
    }, [])

    useEffect(() => {
        const fetchEmployeesData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/employees");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                console.table(result)

                setEmployees(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchEmployeesData()
    }, [])

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


    return (
        <div className="home-container">
            <div className="column-left">
                <div className="home-graph-container">
                    <div>
                        <label className="home-title">Estatísticas</label>
                        <p>Projetos: {projectByStatus?.totalProjectCount}</p>
                    </div>
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
                <div className="home-projects-container">
                    <label className="home-title">Projetos</label>
                    <div className="home-projects-list">
                        {
                            projects.map((e) =>
                                <div className="home-projects">
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
                                <div className="home-employees">
                                    <div>
                                        {e.name}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="suriberto-home"/>
            </div>
        </div>
    );
}