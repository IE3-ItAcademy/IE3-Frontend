import strings from "../../constants/strings.json"
import "./header.scss"

export default function Header() {

    const buttons: any[] = [];
    strings.header.map((e) => {
        buttons.push(e);
    });

    return (
        <div className="app-header">

            <img className="header-logo" src="logo.png" alt="Suriberto"/>
            <div className="header-button-container">
                {
                    buttons.map((e, key) => {
                        return (
                            <a key={key} role="button" className="header-button" href={e.link}>{e.name}</a>
                        );
                    })
                }
            </div>

        </div>
    );
}