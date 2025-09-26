import { useRef } from "react";
import "./postEmployeeModal.scss";
import type { PostEmployeeDTO } from "../../models/PostEmployeeModal";

interface PostModalProps {
  handler: () => void;
}

export default function PostEmployeeModal({ handler }: PostModalProps) {
  const name = useRef("");

  const handlePost = async () => {
    const url = "http://localhost:8080/api/employees";

    const prepareBody: PostEmployeeDTO = {
      name: name.current,
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

  const handleError = () => {
    console.log("Erro ao preencher formulário");
  };

  const validateInput = () => {
    if (name.current === null || name.current === "") {
      console.error("Nome do funcionário não informado.");
      return false;
    }

    return true;
  };

  return (
    <div className="post-modal">
      <div className="post-modal-container">
        <div className="post-modal-section">
          <label>Nome do funcionário:</label>
          <input
            className="post-modal-input"
            onChange={(e) => {
              name.current = e.target.value;
            }}
          />
        </div>

        <button
          className="post-button"
          type="submit"
          onClick={() => {
            validateInput() ? handlePost() : handleError();
            handler();
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
