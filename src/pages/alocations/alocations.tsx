import "./alocations.scss";
import { useEffect, useState } from "react";
import { projects as stringsProjects } from "../../constants/strings.json";
import { Modal } from "@mui/material";
import type { AlocationDTO } from "../../models/AlocationDTO";
import NameFilter from "../../components/nameFilter/nameFilter";
import AlocationModal from "../../components/alocationModal/alocationModal";
import PostAlocationModal from "../../components/postAlocationModal/postAlocationModal";
import {
  roleClassMap,
  roleMap,
  roleMapTranslation,
} from "../../constants/roleMap";

export default function Alocations() {
  const [alocations, setAlocations] = useState<AlocationDTO[]>([]);
  const [filteredAlocations, setFilteredAlocations] = useState<AlocationDTO[]>(
    []
  );
  const [openAlocationModal, setOpenAlocationModal] = useState(false);
  const [openNewAlocationModal, setNewAlocationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alocationId, setAlocationId] = useState(1);

  const alocationsPerPage = 6;
  const indexOfLastAlocation = currentPage * alocationsPerPage;
  const indexOfFirstContract = indexOfLastAlocation - alocationsPerPage;
  const currentContracts = filteredAlocations.slice(
    indexOfFirstContract,
    indexOfLastAlocation
  );

  const totalPages = Math.ceil(filteredAlocations.length / alocationsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterHandler = (filteredAlocations: AlocationDTO[]) => {
    setFilteredAlocations(filteredAlocations);
  };

  useEffect(() => {
    fetchAlocations();
  }, []);

  const fetchAlocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alocations");

      if (!response.ok) {
        console.error("deu ruim");
      }

      const result = await response.json();

      console.table(result);

      setAlocations(result);
      setFilteredAlocations(result);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="alocations">
      <div className="alocations-container">
        <div className="page-filter-container">
          <NameFilter list={alocations} handler={filterHandler} />
        </div>

        <div className="alocations-container-body">
          {currentContracts.map((i) => {
            return (
              <a
                key={i.id}
                className="alocation"
                role="button"
                onClick={() => {
                  setOpenAlocationModal(true);
                  setAlocationId(i.id);
                }}
              >
                <div className="employee-name">
                  <p>{i.employeeName}</p>
                </div>
                <div
                  className={`employee-name employee-role role ${
                    roleClassMap[i.employeeRole]
                  }`}
                >
                  <p>{roleMapTranslation[i.employeeRole]}</p>
                </div>
                <div className="employee-name employee-project">
                  <p>{i.projectName}</p>
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
        className="create-alocation-button"
        role="button"
        onClick={() => {
          setNewAlocationModal(true);
        }}
      >
        <img src="add_circle.svg" alt="Create new alocation button" />
        <p>{stringsProjects.createAlocation}</p>
      </a>

      <Modal
        open={openAlocationModal}
        onClose={() => setOpenAlocationModal(false)}
      >
        <AlocationModal id={alocationId} />
      </Modal>

      <Modal
        open={openNewAlocationModal}
        onClose={() => setNewAlocationModal(false)}
      >
        <PostAlocationModal
          handler={() => {
            setNewAlocationModal(false);
            fetchAlocations();
          }}
        />
      </Modal>
    </div>
  );
}
