import { useEffect, useState } from "react";
import "./home.scss"
import { PieChart } from '@mui/x-charts/PieChart';
import type { ProjectByStatusDTO } from "../../models/ProjectByStatusDTO";
import type { ProjectDTO } from "../../models/ProjectDTO";
import { projects as stringsProjects } from "../../constants/strings.json"

export default function Home() {
    const [projectByStatus, setProjectByStatus] = useState<ProjectByStatusDTO>()
    const [graphData, setGraphData] = useState<any[]>([])
    const [projects, setProjects] = useState<ProjectDTO[]>([])
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
        if (projectByStatus) {
            const data = [
                { id: 0, value: projectByStatus.completedProjectCount, label: "Concluído" },
                { id: 1, value: projectByStatus.plannedProjectCount, label: "Em espera" },
                { id: 2, value: projectByStatus.unavailableProjectCount, label: "Inválido" },
                { id: 3, value: projectByStatus.availableProjectCount, label: "Em andamento" },
                { id: 4, value: projectByStatus.finishedProjectCount, label: "Inconcluído" },
            ];
            setGraphData(data);
        }
    }, [projectByStatus]);

    const statusClassMap: Record<string, string> = {
        [stringsProjects.completed]: "completed",
        [stringsProjects.planned]: "notStarted",
        [stringsProjects.available]: "inProgress",
        [stringsProjects.unavailable]: "invalid",
        [stringsProjects.finished]: "finished"
    }

    const statusMap: Record<string, string> = {
        [stringsProjects.completed]: "Concluído",
        [stringsProjects.planned]: "Em espera",
        [stringsProjects.available]: "Em andamento",
        [stringsProjects.unavailable]: "Inválido",
        [stringsProjects.finished]: "Inconcluído"
    }

    return (
        <div className="home-container">
            <div className="home-projects-container">
                <label className="home-title">Projetos</label>

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
            <div className="home-graph-container">
                <label className="home-title">Estatísticas</label>
                <p>Total: {projectByStatus?.totalProjectCount}</p>
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
        </div>
    );
}