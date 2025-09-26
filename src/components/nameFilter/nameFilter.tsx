import { useEffect, useState } from "react";
import "./nameFilter.scss";
import type { AlocationDTO } from "../../models/AlocationDTO";

interface FilterProps {
  list: AlocationDTO[];
  handler: (filteredList: AlocationDTO[]) => void;
}

export default function NameFilter({ list, handler }: FilterProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    const filtered = list.filter((item) => {
      const employeeMatch = item.employeeName
        ?.toLowerCase()
        .includes(name.toLowerCase());
      const projectMatch = item.projectName
        ?.toLowerCase()
        .includes(name.toLowerCase());

      return employeeMatch || projectMatch;
    });

    handler(name ? filtered : list);
  }, [name, list, handler]);

  return (
    <div className="filter-container">
      <div className="filter-input-container">
        <label className="filter-label">Nome</label>
        <input
          className="filter-input"
          type="text"
          placeholder="Digite o nome do funcionário ou projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </div>
  );
}
