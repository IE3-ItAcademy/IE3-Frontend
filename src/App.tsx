import "./App.css";
import Header from "./components/header/header";
import Contracts from "./pages/contracts/contracts";
import Projects from "./pages/projects/projects";

function App() {
  return (
    <>
      <Header />
      {/* <Projects /> */}
      <Contracts />
    </>
  );
}

export default App;
