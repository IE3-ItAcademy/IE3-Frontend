import "./contracts.scss";
import { useEffect, useState } from "react";
import Filter from "../../components/filter/filter";
import { projects as stringsProjects } from "../../constants/strings.json";
import type { ContractDTO } from "../../models/ContractDTO";
import ContractModal from "../../components/contractModal/contractModal";
import { Modal } from "@mui/material";
import PostContractModal from "../../components/postContractModal/postContractModal";

export default function Contracts() {
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractDTO[]>([]);
  const [openContractModal, setOpenContractModal] = useState(false);
  const [openNewContractModal, setNewContractModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractId, setContractId] = useState(1);

  const contractsPerPage = 6;
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );

  const statusMap: Map<boolean, string> = new Map([
    [true, "Ativo"],
    [false, "Inativo"],
  ]);

  const statusClassMap: Map<boolean, string> = new Map([
    [true, "active"],
    [false, "inactive"],
  ]);

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
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
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
                className="contract"
                role="button"
                onClick={() => {
                  setOpenContractModal(true);
                  setContractId(i.id);
                }}
              >
                <div className="employee-name">{i.name}</div>
                <div className="contract-status">
                  <div
                    className={`status contract ${statusClassMap.get(
                      i.activeContract
                    )}`}
                  >
                    {statusMap.get(i.activeContract)}
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
        className="create-contract-button"
        role="button"
        onClick={() => {
          setNewContractModal(true);
        }}
      >
        <img src="add_circle.svg" alt="Create new contract button" />
        <p>{stringsProjects.createContract}</p>
      </a>

      <Modal
        open={openContractModal}
        onClose={() => setOpenContractModal(false)}
      >
        <ContractModal id={contractId} />
      </Modal>

      <Modal
        open={openNewContractModal}
        onClose={() => setNewContractModal(false)}
      >
        <PostContractModal
          handler={() => {
            setNewContractModal(false);
            fetchContracts();
          }}
        />
      </Modal>
    </div>
  );
}
