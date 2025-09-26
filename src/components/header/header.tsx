import { useState } from "react";
import strings from "../../constants/strings.json";
import "./header.scss";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const location = useLocation();
  const buttons = strings.header;

  return (
    <div className="app-header">
      <a role="button" href="/">
        <img className="header-logo" src="logo.png" alt="Suriberto" />
      </a>
      <div className="header-button-container">
        {buttons.map((e, key) => {
          const isActive = activeIndex === key || location.pathname === e.link;

          return (
            <Link key={key} to={e.link} onClick={() => setActiveIndex(key)}>
              <span
                role="button"
                className={`header-button ${isActive ? "current-page" : ""}`}
              >
                {e.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
