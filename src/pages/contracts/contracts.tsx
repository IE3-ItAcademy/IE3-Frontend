import "./projects.scss";
import { useEffect, useState } from "react";
import Filter from "../../components/filter/filter";
import { projects as stringsProjects } from "../../constants/strings.json";
import type { ContractDTO } from "../../models/ContractDTO";

export default function Contracts() {
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractDTO[]>([]);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openNewProjectModal, setNewProjectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const contractsPerPage = 6;
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterHandler = (filteredContracts: ContractDTO[]) => {
    setFilteredContracts(filteredContracts);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/contracts");

        if (!response.ok) {
          console.error("deu ruim");
        }

        const result = await response.json();

        console.table(result);

        setContracts(result);
        setFilteredContracts(result);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="contracts">
      <div className="contracts-container">
        <div className="page-filter-container">
          <Filter handler={filterHandler} list={contracts} />
        </div>

        <div className="contracts-container-body">
          {currentContracts.map((i) => {
            return (
              <a
                key={i.id}
                className="project"
                role="button"
                onClick={() => {
                  setOpenProjectModal(true);
                  console.log(openProjectModal);
                }}
              >
                <div>{i.name}</div>
                <div className="project-status">
                  <div className={`status ${statusClassMap[i.status]}`}>
                    {statusMap[i.status]}
                  </div>
                </div>
              </a>
            );
          })}

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
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

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <img src={"/chevron_right.svg"} />
            </button>
          </div>
        </div>
      </div>
      <a
        className="create-project-button"
        role="button"
        onClick={() => {
          setNewProjectModal(true);
        }}
      >
        <img src="add_circle.svg" alt="Create new project button" />
        <p>{stringsProjects.createProject}</p>
      </a>

      {/*openNewProjectModal && @TODO: <Modal></Modal>*/}
      {/*openProjectModal && @TODO: <Modal></Modal>*/}
    </div>
  );
}
