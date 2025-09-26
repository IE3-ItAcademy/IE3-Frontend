import { useEffect, useState } from "react";
import "./employeeNameFilter.scss";
import type { EmployeesReadDTO } from "../../models/EmployeesReadDTO";

interface FilterProps {
  list: EmployeesReadDTO[];
  handler: (filteredList: EmployeesReadDTO[]) => void;
}

export default function EmployeeNameFilter({ list, handler }: FilterProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    const filtered = list.filter((item) => {
      const employeeMatch = item.name
        ?.toLowerCase()
        .includes(name.toLowerCase());

      return employeeMatch;
    });

    handler(name ? filtered : list);
  }, [name, list, handler]);

  return (
    <div className="filter-container">
      <div className="filter-input-container name-filter">
        <label className="filter-label">Nome</label>
        <input
          className="filter-input"
          type="text"
          placeholder="Digite o nome do funcionário"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </div>
  );
}
