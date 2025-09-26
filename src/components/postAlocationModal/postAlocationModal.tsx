import { useEffect, useRef, useState } from "react";
import "./postAlocationModal.scss";
import type { EmployeesDTO } from "../../models/EmployeesDTO";
import type { ProjectDTO } from "../../models/ProjectDTO";
import type { PostAlocationDTO } from "../../models/PostAlocationDTO";

interface PostModalProps {
  handler: () => void;
}

export default function PostAlocationModal({ handler }: PostModalProps) {
  const employeeId = useRef(0);
  const projectId = useRef(0);
  const profile = useRef("");

  const [employees, setEmployees] = useState<EmployeesDTO[]>([]);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);

  const roleMap: Map<string, string> = new Map([
    ["Gerente", "MANAGER"],
    ["Desenvolvedor", "DEV"],
    ["QA", "QA"],
    ["Segurança", "SECURITY"],
  ]);

  const baseUrl = "http://localhost:8080/api";

  // carregar projetos ao abrir modal
  useEffect(() => {
    getProjects();
  }, []);

  // carregar funcionários sempre que projeto ou horas mudarem
  useEffect(() => {
    if (projectId.current !== 0 && weeklyHours > 0) {
      getEmployees();
    }
  }, [weeklyHours, projects]);

  const getProjects = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/projects/projectsLessFinishedAndComplete`
      );
      if (!response.ok) throw new Error("Erro ao buscar projetos");
      const result = await response.json();
      setProjects(result);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/employees/getEmployeesWithWeeklyHoursForProject/${projectId.current}?weeklyHours=${weeklyHours}`
      );
      if (!response.ok) throw new Error("Erro ao buscar funcionários");
      const result = await response.json();
      setEmployees(result);
    } catch (error) {
      console.error(error);
    }
  };

  const validateInput = () => {
    if (!projectId.current || projectId.current <= 0) {
      console.error("Projeto não selecionado.");
      return false;
    }

    if (!employeeId.current || employeeId.current <= 0) {
      console.error("Funcionário não selecionado.");
      return false;
    }

    if (!profile.current) {
      console.error("Cargo não selecionado.");
      return false;
    }

    if (!weeklyHours || weeklyHours <= 0) {
      console.error("Horas semanais inválidas.");
      return false;
    }

    return true;
  };

  const getEmployeeRoles = (employeeId: number) => {
    const employee = employees.find((emp) => emp.id === employeeId);

    setRoleOptions(employee ? employee.roles : []);
  };

  const handlePost = async () => {
    const url = `${baseUrl}/alocations`;
    const body: PostAlocationDTO = {
      employee: employeeId.current,
      project: projectId.current,
      weeklyHours: weeklyHours,
      employeeRole: profile.current,
    };

    console.log(body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Erro ao criar alocação");
      } else {
        const result = await response.json();
        console.log("Success:", result);
        handler();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleError = () => {
    console.log("Erro ao preencher formulário");
  };

  const enableEmployeeInput = projectId.current !== 0 && weeklyHours > 0;

  return (
    <div className="post-modal">
      <div className="post-modal-container">
        <div className="post-modal-section">
          <label>Selecione um projeto:</label>
          <select
            className="post-date-input"
            onChange={(e) => {
              projectId.current = Number(e.target.value);
            }}
          >
            <option value="">Selecione...</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="post-modal-section">
          <label>Horas por semana</label>
          <input
            className="post-modal-input"
            type="number"
            min="0"
            step="1"
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
          />
        </div>

        <div className="post-modal-section">
          <label>Selecione um funcionário:</label>
          <select
            disabled={!enableEmployeeInput}
            className="post-date-input"
            onChange={(e) => {
              employeeId.current = Number(e.target.value);
              getEmployeeRoles(employeeId.current);
            }}
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
          <label>Selecione um cargo:</label>
          <select
            className="post-date-input"
            onChange={(e) => (profile.current = e.target.value)}
          >
            <option value="">Selecione...</option>
            {roleOptions.map((role, index) => (
              <option key={index} value={roleMap.get(role)}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button
          className="post-button"
          type="submit"
          onClick={() => {
            validateInput() ? handlePost() : handleError();
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
