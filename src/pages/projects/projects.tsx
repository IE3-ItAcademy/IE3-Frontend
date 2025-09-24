import "./projects.scss";
import { useEffect, useState } from "react";
import type { ProjectDTO } from "../../models/ProjectDTO";
import Filter from "../../components/filter/filter";
import { projects as stringsProjects } from "../../constants/strings.json"
import ReactModal from 'react-modal';

export default function Projects() {
    const [projects, setProjects] = useState<ProjectDTO[]>([])
    const [filteredProjects, setFilteredProjects] = useState<ProjectDTO[]>([])
    const [openModal, setOpenModal] = useState(false);

    const filterHandler = (filteredProjects: ProjectDTO[]) => {
        setFilteredProjects(filteredProjects)
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await fetch("http://localhost:8080/api/projects");

                if (!response.ok) {
                    console.error("deu ruim")
                }

                const result = await response.json();

                console.table(result)

                setProjects(result)
                setFilteredProjects(result)
            } catch (error: any) {
                console.error(error.message)
            }
        }

        fetchData()
    }, [])

    const statusClassMap: Record<string, string> = {
        [stringsProjects.completed]: "completed",
        [stringsProjects.planned]: "notStarted",
        [stringsProjects.available]: "inProgress",
        [stringsProjects.unavailable]: "invalid"
    }

    const statusMap: Record<string, string> = {
        [stringsProjects.completed]: "Concluído",
        [stringsProjects.planned]: "Em espera",
        [stringsProjects.available]: "Em andamento",
        [stringsProjects.unavailable]: "Inválido"
    }


    return (
        <>
            <a className="projects" role="button" onClick={() => {
                setOpenModal(true)
                console.log(openModal)
            }}>

                <div className="projects-container">
                    <div className="page-filter-container">
                        <Filter handler={filterHandler} list={projects} />
                    </div>

                    <div className="projects-container-body">
                        {
                            filteredProjects.map((i) => {
                                return (
                                    <div key={i.id} className='project'>
                                        <div>
                                            {i.name}
                                        </div>
                                        <div className="project-status">
                                            <div className={`status ${statusClassMap[i.status]}`}>{statusMap[i.status]}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </a>
        </>
    );
}