import "./projectModal.scss"
import { use, useEffect, useState } from "react";
import type { ProjectDTO } from "../../models/ProjectDTO";
import { projects as stringsProjects } from "../../constants/strings.json"

interface ProjectModalProps {
    id: number;
}

export default function ProjectModal({ id }: ProjectModalProps) {
    const [project, setProject] = useState<ProjectDTO>()
    const [costPeriod, setCostPeriod] = useState<[string, string]>(["", ""])
    const [clicked, setClicked] = useState(false);
    useEffect(() => {
        const fetchData = async () => {

            try {


                const response = await fetch(
                    (costPeriod[0] != "" && costPeriod[1] != "")
                        ? `http://localhost:8080/api/projects/modal/${id}?startDate=${costPeriod[0]}&endDate=${costPeriod[1]}`
                        : `http://localhost:8080/api/projects/modal/${id}`
                );

                console.log({ response })

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                setProject(result)
                console.table({ result })

            } catch (error: any) {
                console.error(error.message)
            }
        }
        fetchData()

        if (costPeriod[0] === "" && project) {
            setCostPeriod(prev => [formatDateReq(project?.startDate), prev[1]])
        }

        if (costPeriod[1] === "" && project) {
            setCostPeriod(prev => [prev[0], formatDateReq(project?.endDate)])
        }


    }, [clicked])


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


    const formatDate = (s: string) => {
        const d = new Date(s);
        return `${d.getDate().toString().padStart(2, '0')} / ${(d.getMonth() + 1).toString().padStart(2, '0')} / ${d.getFullYear()}`;
    };

    const formatDateReq = (s: string) => {
        const d = new Date(s);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <div className="modal-projects">
            {project &&
                <div className="modal-container">
                    <div className="modal-title-container">
                        <p className="modal-project-title">{project.name}</p>
                        <p className={`modal-status status ${statusClassMap[project.status]} `}>{statusMap[project.status]}</p>
                    </div>

                    <main className="modal-project-body">
                        <label className="modal-label">Descrição do Projeto:</label>
                        <div className="teste1">
                            <text className="modal-project-description">{project.description}</text>
                        </div>

                        <div className="modal-section">
                            <div>
                                <label className="modal-label">Início</label>
                                <p className="modal-value">{formatDate(project.startDate)}</p>
                            </div>

                            <div>
                                <label className="modal-label">Término</label>
                                <p className="modal-value">{formatDate(project.endDate)}</p>
                            </div>
                        </div>

                        <div className="modal-section">
                            <div>
                                <label className="modal-label">Custo Total</label>
                                <p className="modal-value">{`SB$ ${project.costs.totalCost}`}</p>
                            </div>
                        </div>
                        <div className="modal-period">
                            <label className="modal-label">Custo período</label>
                            <div className="period-inputs">
                                <label className="modal-label">De</label>
                                <input
                                    className="modal-input"
                                    type="date"
                                    value={formatDateReq(costPeriod[0])}
                                    onChange={(e) => setCostPeriod(prev => [formatDateReq(e.target.value), prev[1]])}
                                />
                                <label className="modal-label">Até</label>
                                <input
                                    className="modal-input"
                                    type="date"
                                    value={formatDateReq(costPeriod[1])}
                                    onChange={(e) => setCostPeriod(prev => [prev[0], formatDateReq(e.target.value)])}
                                />
                                <label className="suribertos-modal">SB$</label>
                                <p className="modal-value">{`SB$ ${project.costs.totalCostPerPeriod}`}</p>
                            </div>
                            <button className="period-cost-button"
                                onClick={() => {
                                    setClicked(!clicked)
                                    console.log({ costPeriod })
                                }}>Calcular</button>
                        </div>

                        <div className="modal-employees-container">
                            <label className="modal-label">Equipe</label>
                            <div className="modal-employees-list">
                                {project.employees.length > 0 ?
                                    project.employees.map((e, index) =>
                                        <p className="modal-employees">{(index + 1) + ") " + e}</p>
                                    )
                                    : <p className="modal-no-team">Não há equipe alocada</p>
                                }
                            </div>

                        </div>
                    </main>
                </div>
            }
        </div>
    );
}