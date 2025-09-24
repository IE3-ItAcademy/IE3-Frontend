import "./projects.scss";
import { useEffect, useState } from "react";
import type { ProjectDTO } from "../../models/ProjectDTO";
import Filter from "../../components/filter/filter";
import { projects as stringsProjects } from "../../constants/strings.json"

export default function Projects() {
    const [projects, setProjects] = useState<ProjectDTO[]>([])
    const [filteredProjects, setFilteredProjects] = useState<ProjectDTO[]>([])
    const [openProjectModal, setOpenProjectModal] = useState(false);
    const [openNewProjectModal, setNewProjectModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const projectsPerPage = 6;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
        <div className="projects">
            <div className="projects-container">
                <div className="page-filter-container">
                    <Filter handler={filterHandler} list={projects} />
                </div>

                <div className="projects-container-body">
                    {
                        currentProjects.map((i) => {
                            return (
                                <a key={i.id} className='project' role="button" onClick={() => {
                                    setOpenProjectModal(true)
                                    console.log(openProjectModal)
                                }}>
                                    <div>
                                        {i.name}
                                    </div>
                                    <div className="project-status">
                                        <div className={`status ${statusClassMap[i.status]}`}>{statusMap[i.status]}</div>
                                    </div>
                                </a>
                            )
                        })
                    }

                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            <img src={"/chevron_left.svg"} />
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={pageNum === currentPage ? "active" : ""}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            <img src={"/chevron_right.svg"} />
                        </button>
                    </div>

                </div>
            </div>
            <a className="create-project-button" role="button" onClick={() => { setNewProjectModal(true) }}>
                <img src="add_circle.svg" alt="Create new project button" />
                <p>{stringsProjects.createProject}</p>
            </a>

            
                {/*openNewProjectModal && @TODO: <Modal></Modal>*/}
                {/*openProjectModal && @TODO: <Modal></Modal>*/}
            
        </div>
    );
}