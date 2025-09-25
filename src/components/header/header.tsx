import strings from "../../constants/strings.json";
import "./header.scss";
import { Link } from "react-router-dom";

export default function Header() {
  const buttons: any[] = [];
  strings.header.map((e) => {
    buttons.push(e);
  });

  const routeMap: Map<string, string> = new Map([
    ["Funcionário", "employees"],
    ["Contratos", "contracts"],
    ["Alocações", "alocations"],
    ["Projetos", "projects"],
  ]);

  return (
    <div className="app-header">
      <img className="header-logo" src="logo.png" alt="Suriberto" />
      <div className="header-button-container">
        {buttons.map((e, key) => {
          return (
            <Link to={e.link}>
              <a
                key={key}
                role="button"
                className="header-button"
                href={e.link}
              >
                {e.name}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
