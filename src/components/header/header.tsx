import strings from "../../constants/strings.json"
import "./header.scss"

export default function Header() {

    const buttons: any[] = [];
    strings.header.map((e) => {
        buttons.push(e);
    });

    return (
        <div className="app-header">

            <img src="logo.png" alt="Alberto versão suricato" />
            <div className="header-button-container">
                {
                    buttons.map((e) => {
                        return (
                            <a role="button" className="header-button" href={e.link}>{e.name}</a>
                        );
                    })
                }
            </div>

        </div>
    );
}