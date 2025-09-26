import "./App.css";
import Header from "./components/header/header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/projects/projects";
import Contracts from "./pages/contracts/contracts";
import Home from "./pages/home/home";
import Alocations from "./pages/alocations/alocations";
import Employees from "./pages/employees/employees";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/alocations" element={<Alocations />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
