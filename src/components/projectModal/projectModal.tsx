import "./projectModal.scss"
import { useEffect, useState } from "react";
import type { ProjectDTO } from "../../models/ProjectDTO";
import { roleClassMap, roleMap } from "../../constants/roleMap";
import { statusClassMap, statusMap } from "../../constants/statusMap"


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
            console.log({ costPeriod })
        }



    }, [clicked])



    const formatDate = (s: string) => {
        if (!s) return "";
        const d = new Date(s);
        if (isNaN(d.getTime())) return "";
        return `${d.getDate().toString().padStart(2, '0')} / ${(d.getMonth() + 1).toString().padStart(2, '0')} / ${d.getFullYear()}`;
    };

    const formatDateReq = (s: string) => {
        if (!s) return "";
        const d = new Date(s);
        if (isNaN(d.getTime())) return "";
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
                        <div className="modal-date-section">
                            <div className="date-container">
                                <label className="modal-label">Início</label>
                                <p className="modal-value">{formatDate(project.startDate)}</p>
                            </div>

                            <div className="date-container">
                                <label className="modal-label">Término</label>
                                <p className="modal-value">{formatDate(project.endDate)}</p>
                            </div>
                        </div>

                        <label className="modal-label">Descrição do Projeto:</label>
                        <div className="teste1">
                            <text className="modal-project-description">{project.description}</text>
                        </div>

                        <div className="modal-costs-section">

                            <div className="modal-period">
                                <label className="modal-label">Período</label>
                                <div className="period-inputs">
                                    <label className="modal-label">De</label>
                                    <input
                                        className="modal-input"
                                        type="date"
                                        value={costPeriod[0]}
                                        onChange={(e) => setCostPeriod(prev => [formatDateReq(e.target.value), prev[1]])}
                                    />
                                    <label className="modal-label">Até</label>
                                    <input
                                        className="modal-input"
                                        type="date"
                                        value={costPeriod[1]}
                                        onChange={(e) => setCostPeriod(prev => [prev[0], formatDateReq(e.target.value)])}
                                    />
                                </div>
                                <div className="cost-display">
                                    <div className="display1">
                                        <label>Custo período:</label>
                                        <div className="currency-area">
                                            <img className="suriberto-currency" src="suriberto_currency.png" />
                                            <p className="cost-value">{project?.costs.totalCostPerPeriod}</p>
                                        </div>

                                    </div>
                                    <div className="display2">
                                        <label>Custo total:</label>
                                        <div className="currency-area">
                                            <img className="suriberto-currency" src="suriberto_currency.png" />
                                            <p className="cost-value">{project?.costs.totalCost}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="period-cost-button"
                                    onClick={() => {
                                        setClicked(!clicked)
                                        console.table({ project })
                                    }}>Calcular</button>
                            </div>

                        </div>

                        <div className="modal-project-employees-container">
                            <label className="modal-label">Equipe</label>
                            <div className="modal-employees-list">
                                {Object.keys(project.employees).length > 0 ? (
                                    Object.keys(project.employees).map((employeeName: any, index) => {
                                        const role: any = project.employees[employeeName];
                                        return (
                                            <div className="project-employee-container">
                                                <p key={employeeName} className="employee-teste">
                                                    {index + 1}{") "}{employeeName}
                                                </p>
                                                <p className={`role status ${roleClassMap[role]}`}>
                                                    {roleMap[role]}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="modal-no-team">Não há equipe alocada</p>
                                )}
                            </div>

                        </div>
                    </main>
                </div>
            }
        </div>
    );
}