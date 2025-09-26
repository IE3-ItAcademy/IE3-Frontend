import './modal.css';
import { useState } from "react";
import React from "react";

interface CreateEmployeeModalProps{
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateEmployeeModal({ isOpen, onClose, onCreated } : CreateEmployeeModalProps){
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null

    const handleSubmit = async (e?: React.FormEvent) =>{
        if (e) e.preventDefault();
        if(!name.trim()) {
            setError("Nome obrigatório");
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const response = await fetch("http://localhost:8080/api/employees",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim()}),
            });
            if(!response.ok){
                const text = await response.text();
                throw new Error(text || "Erro ao criar funcionário");
            }
            onCreated();
            onClose();
            setName("");
        } catch(err: any) {
            setError(err.message || "Erro");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal-create-overlay">
            <div className="modal-create-content">
                <h2 className="h2-modal-profile">Criar Funcionários</h2>
                <form className="form-create-employee" onSubmit={handleSubmit}>
                    <input className="text-bar"
                        placeholder="Nome do funcionário"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        autoFocus   
                        />
                    {error && <div className="creation-error">{error}</div>}
                    <div className="buttons">
                        <button type="submit" className="create-employee-button" disabled={loading}>
                            {loading ? "Criando..." : "Criar"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
                          Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}