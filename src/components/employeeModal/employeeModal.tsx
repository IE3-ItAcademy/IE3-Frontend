import { statusMap } from "../../constants/statusMap";
import type { EmployeesDTO } from "../../models/EmployeesDTO";
import "./employeeModal.scss";
import { useEffect, useState } from "react";

interface EmployeeModalProps {
  id: number;
}

export default function EmployeeModal({ id }: EmployeeModalProps) {
  const [employee, setEmployee] = useState<EmployeesDTO>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/employees/modal/${id}?`
        );

        if (!response.ok) {
          console.error("deu ruim");
        }

        const result = await response.json();

        setEmployee(result);
        console.table(result);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const profileMap: Map<string, string> = new Map([
    ["MANAGER", "Gerente"],
    ["DEV", "Desenvolvedor"],
    ["QA", "QA"],
    ["SECURITY", "Segurança"],
  ]);

  const contractStatusMap: Map<boolean, string> = new Map([
    [true, "Ativo"],
    [false, "Inativo"],
  ]);

  const statusClassMap: Map<boolean, string> = new Map([
    [true, "active"],
    [false, "inactive"],
  ]);

  return (
    <div className="modal-projects">
      {employee && (
        <div className="modal-container">
          <div className="modal-title-container">
            <p className="modal-project-title">{employee.name}</p>
            <p
              className={`modal-status status ${statusClassMap.get(
                employee.activeContract
              )} `}
            >
              {contractStatusMap.get(employee.activeContract)}
            </p>
          </div>

          <main className="modal-project-body">
            <div className="modal-section">
              <div className="modal-input-row">
                <div className="modal-input-row"></div>
              </div>
            </div>

            <div className="modal-employees-container">
              <label className="modal-label">Cargos:</label>
              <div className="modal-employees-list">
                {employee.roles.length > 0 ? (
                  employee.roles.map((c, index) => (
                    <p className="modal-employees">
                      {index + 1 + ") " + profileMap.get(c)}
                    </p>
                  ))
                ) : (
                  <p className="modal-no-team">
                    O funcionário não possui cargos
                  </p>
                )}
              </div>
            </div>

            <div className="modal-employees-container">
              <label className="modal-label">Projetos:</label>
              <div className="modal-employees-list">
                {employee.projectInfoList.length > 0 ? (
                  employee.projectInfoList.map((c, index) => (
                    <div className="projects-info-container" key={index}>
                      <p className="modal-employees">{c.name} -</p>
                      <p className="modal-employees">{statusMap[c.status]}</p>
                    </div>
                  ))
                ) : (
                  <p className="modal-no-team">
                    O funcionário não possui cargos
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
