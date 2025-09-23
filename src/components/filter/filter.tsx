import { useEffect, useState } from "react";
import "./filter.scss"
import type { ProjectDTO } from "../../models/ProjectDTO";
import type { ContractDTO } from "../../models/ContractDTO";

interface FilterProps {
    list: ProjectDTO[] | ContractDTO[]
    handler: (filteredList: any[]) => void
}

export default function Filter({ list, handler }: FilterProps) {
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        const filtered = list.filter((item) => {
            const matchesName = item.name
                ?.toLowerCase()
                .includes(name.toLowerCase());

            const matchesStart = startDate
                ? item.startDate >= startDate
                : true;

            const matchesEnd = endDate
                ? item.endDate <= endDate
                : true;

            return matchesName && matchesStart && matchesEnd;
        });

        handler(name || startDate || endDate ? filtered : list)


    }, [name, startDate, endDate])

    return (
        <div className="filter-container">
            <div className="filter-input-container">
                <label>Nome</label>
                <input
                    type="text"
                    placeholder="Digite o nome do projeto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="filter-input-container">
                <label>Nome</label>
                <input
                    type="date"
                    placeholder="Data de início"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="filter-input-container">
                <label>Nome</label>
                <input
                    type="date"
                    placeholder="Data de término"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>
    );
}