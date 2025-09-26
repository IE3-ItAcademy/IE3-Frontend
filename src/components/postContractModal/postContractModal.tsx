import { useEffect, useRef, useState } from "react";
import "./postContractModal.scss";
import type { PostContractDTO } from "../../models/PostContractDTO";
import type { EmployeesDTO } from "../../models/EmployeesDTO";

interface PostModalProps {
  handler: () => void;
}

export default function PostContractModal({ handler }: PostModalProps) {
  const startDate = useRef(new Date());
  const endDate = useRef(new Date());
  const weeklyHours = useRef(0);
  const wageByHour = useRef(0);
  const employeeId = useRef(0);
  const profile = useRef<number[]>([]);
  const [employees, setEmployees] = useState<EmployeesDTO[]>();
  const [profiles, setProfiles] = useState<number[]>([]);

  useEffect(() => {
    getEmployees();
  }, []);

  const handlePost = async () => {
    const url = "http://localhost:8080/api/contracts";

    const prepareBody: PostContractDTO = {
      employeeId: employeeId.current,
      startDate: startDate.current.toISOString(),
      endDate: endDate.current.toISOString(),
      weeklyHours: weeklyHours.current,
      wageByHour: wageByHour.current,
      profile: profile.current,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepareBody),
      });

      if (!response.ok) {
        console.log("deu ruim");
      } else {
        const result = await response.json();
        console.log("Success:", result);
        handler();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const getEmployees = async () => {
    const url = "http://localhost:8080/api/employees";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error("deu ruim");
      }

      const result = await response.json();

      setEmployees(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (value: number) => {
    setProfiles((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      profile.current = updated;
      return updated;
    });
  };

  const handleError = () => {
    console.log("Erro ao preencher formulário");
  };

  const validateInput = () => {
    if (
      !startDate.current ||
      !endDate.current ||
      startDate.current >= endDate.current
    ) {
      console.error("Data de início inválida ou maior que a data de término.");
      return false;
    }

    if (
      weeklyHours.current === null ||
      isNaN(weeklyHours.current) ||
      weeklyHours.current <= 0
    ) {
      console.error("Horas semanais inválidas.");
      return false;
    }

    if (
      wageByHour.current === null ||
      isNaN(wageByHour.current) ||
      wageByHour.current <= 0
    ) {
      console.error("Salário por hora inválido.");
      return false;
    }

    if (!employeeId.current || employeeId.current <= 0) {
      console.error("Funcionário não selecionado.");
      return false;
    }

    if (!profile.current || profile.current.length === 0) {
      console.error("Nenhum perfil selecionado.");
      return false;
    }

    return true;
  };

  return (
    <div className="post-modal">
      <div className="post-modal-container">
        <div className="post-modal-section">
          <label>Selecione um funcionário</label>
          <select
            className="post-date-input"
            onChange={(e) => (employeeId.current = parseInt(e.target.value))}
          >
            <option value="">Selecione...</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="post-modal-section">
          <label>Data de início</label>
          <input
            className="post-date-input"
            type="date"
            onChange={(e) => (startDate.current = new Date(e.target.value))}
          />
        </div>

        <div className="post-modal-section">
          <label>Data de término</label>
          <input
            className="post-date-input"
            type="date"
            onChange={(e) => (endDate.current = new Date(e.target.value))}
          />
        </div>

        <div className="post-modal-section">
          <label>Horas por semana</label>
          <input
            className="post-modal-input"
            type="number"
            min="0"
            step="1"
            onChange={(e) => {
              const value = e.target.value;
              weeklyHours.current = value ? Number(value) : 0;
            }}
          />
        </div>

        <div className="post-modal-section">
          <label>Salário por hora</label>
          <input
            className="post-modal-input"
            type="number"
            min="0"
            step="1"
            onChange={(e) => {
              const value = e.target.value;
              wageByHour.current = value ? Number(value) : 0;
            }}
          />
        </div>

        <div className="post-modal-section">
          <label>Selecione um perfil</label>
          <div className="checkbox-container">
            <input type="checkbox" onChange={() => handleCheckboxChange(1)} />
            <label>Gerente</label>
          </div>
          <div className="checkbox-container">
            <input type="checkbox" onChange={() => handleCheckboxChange(2)} />
            <label>Desenvolvedor</label>
          </div>
          <div className="checkbox-container">
            <input type="checkbox" onChange={() => handleCheckboxChange(3)} />
            <label>QA</label>
          </div>
          <div className="checkbox-container">
            <input type="checkbox" onChange={() => handleCheckboxChange(4)} />
            <label>Segurança</label>
          </div>
        </div>

        <button
          className="post-button"
          type="submit"
          onClick={() => {
            validateInput() ? handlePost() : handleError();
            handler();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
