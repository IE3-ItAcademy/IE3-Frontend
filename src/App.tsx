import "./App.css";
import Header from "./components/header/header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/projects/projects";
import Contracts from "./pages/contracts/contracts";
import Home from "./pages/home/home";
import Alocations from "./pages/alocations/alocations";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/projects" element={<Projects />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/alocations" element={<Alocations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
