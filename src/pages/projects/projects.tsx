import "./projects.scss";
import { useEffect, useState } from "react";
import type { ProjectDTO } from "../../models/ProjectDTO";
import Filter from "../../components/filter/filter";


export default function Projects() {
    const [projects, setProjects] = useState<ProjectDTO[]>([])
    const [filteredProjects, setFilteredProjects] = useState<ProjectDTO[]>([])

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



    return (
        <div className="projects">

            <div className="projects-container">
                <div className="page-filter-container">
                    <Filter handler={filterHandler} list={projects} />
                </div>

                <div className="projects-container-body">
                    {
                        filteredProjects.map((i) => {
                            return (
                                <div key={i.id} className='project'>
                                    {i.name}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}