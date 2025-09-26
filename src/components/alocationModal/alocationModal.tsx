import type { AlocationDTO } from "../../models/AlocationDTO";
import "./alocationModal.scss";
import { useEffect, useState } from "react";

interface AlocationModalProps {
  id: number;
}

export default function AlocationModal({ id }: AlocationModalProps) {
  const [alocation, setAlocation] = useState<AlocationDTO>();

  const roleMap: Map<string, string> = new Map([
    ["DEV", "Desenvolvedor"],
    ["MANAGER", "Gerente"],
    ["QA", "QA"],
    ["SECURITY", "Segurança"],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/alocations/${id}?`
        );

        if (!response.ok) {
          console.error("deu ruim");
        }

        const result = await response.json();

        setAlocation(result);
        console.table(result);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getDate().toString().padStart(2, "0")} / ${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")} / ${d.getFullYear()}`;
  };

  return (
    <div className="modal-alocation">
      {alocation && (
        <div className="modal-container">
          <div className="modal-title-container">
            <p className="modal-alocation-title">Alocação - {alocation.id}</p>
          </div>

          <main className="modal-alocation-body">
            <div className="modal-section">
              <div className="modal-input-row">
                <div className="input-container">
                  <label className="modal-label">Nome do funcionário:</label>
                  <p className="modal-value">{alocation.employeeName}</p>
                </div>

                <div className="input-container">
                  <label className="modal-label">Nome do projeto:</label>
                  <p className="modal-value">{alocation.projectName}</p>
                </div>
              </div>

              <div className="modal-input-row">
                <div className="input-container">
                  <label className="modal-label">Cargo do funcionário:</label>
                  <p className="modal-value">
                    {roleMap.get(alocation.employeeRole)}
                  </p>
                </div>

                <div className="input-container">
                  <label className="modal-label">Horas por semana:</label>
                  <p className="modal-value">{alocation.weeklyHours}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
