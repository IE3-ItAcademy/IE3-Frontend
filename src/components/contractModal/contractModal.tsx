import type { ContractDTO } from "../../models/ContractDTO";
import "./contractModal.scss";
import { useEffect, useState } from "react";

interface ContractModalProps {
  id: number;
}

export default function ContractModal({ id }: ContractModalProps) {
  const [contract, setContract] = useState<ContractDTO>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/contracts/${id}?`
        );

        if (!response.ok) {
          console.error("deu ruim");
        }

        const result = await response.json();

        setContract(result);
        console.table(result);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const profileMap: Map<Number, string> = new Map([
    [1, "Gerente"],
    [2, "Desenvolvedor"],
    [3, "QA"],
    [4, "Segurança"],
  ]);

  const statusMap: Map<boolean, string> = new Map([
    [true, "Ativo"],
    [false, "Inativo"],
  ]);

  const statusClassMap: Map<boolean, string> = new Map([
    [true, "active"],
    [false, "inactive"],
  ]);

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getDate().toString().padStart(2, "0")} / ${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")} / ${d.getFullYear()}`;
  };

  return (
    <div className="modal-projects">
      {contract && (
        <div className="modal-container">
          <div className="modal-title-container">
            <p className="modal-project-title">{contract.name}</p>
            <p
              className={`modal-status status ${statusClassMap.get(
                contract.activeContract
              )} `}
            >
              {statusMap.get(contract.activeContract)}
            </p>
          </div>

          <main className="modal-project-body">
            <div className="modal-section">
              <div className="modal-input-row">
                <div className="input-container">
                  <label className="modal-label">Início</label>
                  <p className="modal-value">
                    {formatDate(contract.startDate)}
                  </p>
                </div>

                <div className="input-container">
                  <label className="modal-label">Término</label>
                  <p className="modal-value">{formatDate(contract.endDate)}</p>
                </div>
              </div>

              <div className="modal-input-row">
                <div className="input-container">
                  <label className="modal-label">Salário por hora</label>
                  <p className="modal-value">{`SB$ ${contract.wageByHour}`}</p>
                </div>

                <div className="input-container">
                  <label className="modal-label">Horas por semana</label>
                  <p className="modal-value">{contract.weeklyHours}</p>
                </div>
              </div>
            </div>

            <div className="modal-employees-container">
              <label className="modal-label">Cargos</label>
              <div className="modal-employees-list">
                {contract.profile.length > 0 ? (
                  contract.profile.map((c, index) => (
                    <p className="modal-employees">
                      {index + 1 + ") " + profileMap.get(c)}
                    </p>
                  ))
                ) : (
                  <p className="modal-no-team">
                    O contrato não possui funcionários
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
