import "./employees.scss";
import { useEffect, useState } from "react";
import { projects as stringsProjects } from "../../constants/strings.json";
import { Modal } from "@mui/material";
import PostContractModal from "../../components/postContractModal/postContractModal";
import type { EmployeesReadDTO } from "../../models/EmployeesReadDTO";
import EmployeeNameFilter from "../../components/employeeNameFilter/employeeNameFilter";
import EmployeeModal from "../../components/employeeModal/employeeModal";
import PostEmployeeModal from "../../components/postEmployeeModal/postEmployeeModal";

export default function Employees() {
  const [employees, setEmployees] = useState<EmployeesReadDTO[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<
    EmployeesReadDTO[]
  >([]);
  const [openEmployeestModal, setOpenEmployeesModal] = useState(false);
  const [openNewEmployeeModal, setNewEmployeeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractId, setContractId] = useState(1);

  const employeesPerPage = 6;
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterHandler = (filteredEmployees: EmployeesReadDTO[]) => {
    setFilteredEmployees(filteredEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employees");

      if (!response.ok) {
        console.error("deu ruim");
      }

      const result = await response.json();

      console.table(result);

      setEmployees(result);
      setFilteredEmployees(result);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="contracts">
      <div className="contracts-container">
        <div className="page-filter-container">
          <EmployeeNameFilter handler={filterHandler} list={employees} />
        </div>

        <div className="contracts-container-body">
          {currentEmployees.map((i) => {
            return (
              <a
                key={i.id}
                className="contract"
                role="button"
                onClick={() => {
                  setOpenEmployeesModal(true);
                  setContractId(i.id);
                }}
              >
                <div className="employee-name">{i.name}</div>
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
          setNewEmployeeModal(true);
        }}
      >
        <img src="add_circle.svg" alt="Create new employee button" />
        <p>{stringsProjects.createEmployee}</p>
      </a>

      <Modal
        open={openEmployeestModal}
        onClose={() => setOpenEmployeesModal(false)}
      >
        <EmployeeModal id={contractId} />
      </Modal>

      <Modal
        open={openNewEmployeeModal}
        onClose={() => setNewEmployeeModal(false)}
      >
        <PostEmployeeModal
          handler={() => {
            setNewEmployeeModal(false);
            fetchEmployees();
          }}
        />
      </Modal>
    </div>
  );
}
