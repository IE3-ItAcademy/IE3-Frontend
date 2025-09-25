import { useRef } from "react";
import "./postProjectModal.scss"
import type { PostProjectDTO } from "../../models/PostProjectDTO";

interface PostModalProps {
    handler: () => void
}

export default function PostProjectModal({handler}: PostModalProps) {
    const projectName = useRef("");
    const startDate = useRef(new Date());
    const endDate = useRef(new Date());
    const description = useRef("");

    const handlePost = async () => {
        const url = "http://localhost:8080/api/projects"

        const prepareBody: PostProjectDTO = {
            name: projectName.current,
            startDate: startDate.current.toISOString(),
            endDate: endDate.current.toISOString(),
            description: description.current
        }

        console.log(JSON.stringify(prepareBody))

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(prepareBody)
            });

            if (!response.ok) {
                console.log("deu ruim");
            } else {
                const result = await response.json();
                console.log("Success:", result);
            }

        } catch (error: any) {
            console.error(error.message)
        }
    }

    const handleError = () => {
        console.log("AEEEEE")
    }

    const validateInput = () => {
        if (startDate.current >= endDate.current) {
            console.error("Data início >= data término");
            return false;
        }

        if (projectName.current === "") {
            console.error("Nome vazio");
            return false;
        }

        if (description.current === "") {
            console.error("Descrição vazia");
            return false;
        }

        return true;
    }

    return (
        <div className="post-modal">

            <div className="post-modal-container">
                <div className="post-modal-section">
                    <label>Nome do projeto</label>
                    <input className="post-modal-input" type="text" onChange={(e) => projectName.current = e.target.value} />
                </div>

                <div className="post-modal-section">
                    <label>Descrição do projeto</label>
                    <textarea className="post-description-input" onChange={(e) => description.current = e.target.value} />
                </div>

                <div className="post-modal-section">
                    <label>Data de início</label>
                    <input className="post-date-input" type="date" onChange={(e) => startDate.current = new Date(e.target.value)} />
                </div>

                <div className="post-modal-section">
                    <label>Data de término</label>
                    <input className="post-date-input" type="date" onChange={(e) => endDate.current = new Date(e.target.value)} />
                </div>

                <button className="post-button" type="submit" onClick={() => {
                    validateInput() ? handlePost() : handleError()
                    handler()
                }}>Submit</button>
            </div>
        </div>

    );
}