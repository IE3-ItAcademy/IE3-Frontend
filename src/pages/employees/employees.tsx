import './employees.css';
import { FaSearch, FaUser, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchEmployees, fetchEmployeeModal } from '../../services/funcionariosService';
import CreateEmployeeModal from '../../components/EmployeeCreationModal/modal';

function ProfileModal({isOpen, onClose, children}: {isOpen: boolean, onClose: () => void, children: React.ReactNode}){
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Fechar</button>
                {children}
            </div>
        </div>
    );
}

function Employees(){
    const [employees, setEmployees] = useState<{id: number, name: string}[]>([]);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<any>(null);
    const [search, setSearch] = useState("");
    
    const filteredEmployees = (employees || []).filter(e =>
        e && e.name && e.name.toLowerCase().includes(search.toLowerCase())
    );

    const fetchAndSetEmployees = () => {
        fetchEmployees()
        .then(data => setEmployees(data))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAndSetEmployees();
    }, []);

    function handleDelete(funcionario: string){
        console.log(`Deletar ${funcionario}`);
    }

    function openEditModal(){
        console.log('Abrir modal de edição');
    }

    async function openProfileModal(employee: string, id: number) {
        setSelectedEmployeeId(id);
        setProfileModalOpen(true);
        const details = await fetchEmployeeModal(id);
        setEmployeeDetails(details);
    }

    function closeProfileModal() {
        setProfileModalOpen(false);
        setSelectedEmployeeId(null);
        setEmployeeDetails(null);
    }

    return(
        <div className="container">
            <div className="search-container">
                <input type="text" placeholder="Pesquisar..." className="search-bar" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <FaSearch className="search-icon"/>
            </div>
            <div className="box-funcionarios">
                <ul className="lista-funcionarios">
                    {filteredEmployees.map((funcionario) => (
                        <li key={funcionario.id} className="item-funcionario">
                            <div className="nome-funcionario">{funcionario.name}</div>
                            <div className="container-buttons">
                                <button className='profile-button' onClick={() => openProfileModal(funcionario.name, funcionario.id)}><FaUser className='profile-button'/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="create-button-container">
                <button className="create-button" onClick={() => setOpenCreateModal(true)}>
                    <img src="add_circle.svg" alt="add-circle" />
                    Adicionar funcionário
                </button>
            </div>


            <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal}>
                <div className="employee-card">
                    <h2 className='h2-modal-profile'>Perfil do Funcionário</h2>
                </div>
                <div className="profile-modal-content">
                    {employeeDetails && (
                        <>
                            <div key={employeeDetails.id} className="funcionario-card">
                                <div className="funcionario-nome">Nome: {employeeDetails.name}</div>
                                <div className={`funcionario-status`}>
                                    Estado de contrato: {employeeDetails.activeContract ? <span style={{color: '#228B22', paddingLeft: '8px'}}>Ativo</span> : <span style={{color: '#a02727ff'}}>Inativo</span>}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="projs">
                        <h3 className='h3-modal-profile'>Projetos Associados:</h3>
                        <ul className='ul-modal-profile'>
                            {employeeDetails && employeeDetails.projectInfoList?.map((proj: any, idx: number) => (
                                <li key={idx}>
                                    {proj.name}
                                    {proj.status === "AVAILABLE" && (
                                        <span className='status-txt' style={{ backgroundColor: '#1078a530', color: '#1078a5', border: '1px solid #1078a5' }}>Ativo</span>
                                    )}
                                    {proj.status === "UNAVAILABLE" && (
                                        <span className='status-txt' style={{ backgroundColor: '#0d8c2930', color: '#0d8c29', border: '1px solid #0d8c29' }}>Indisponível</span>
                                    )}
                                    {proj.status === "PLANNED" && (
                                        <span className='status-txt' style={{ backgroundColor: '#f2b35c30', color: '#f2b35c', border: '1px solid #f2b35c' }}>Planejado</span>
                                    )}
                                    {proj.status === "COMPLETED" && (
                                        <span className='status-txt' style={{ backgroundColor: '#0d8c2930', color: '#0d8c29', border: '1px solid #0d8c29' }}>Concluído</span>
                                    )}
                                    {proj.status === "FINISHED" && (
                                        <span className='status-txt' style={{ backgroundColor: '#50514f30', color: '#50514f', border: '1px solid #50514f' }}>Inconcluído</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ProfileModal>

            <CreateEmployeeModal
                isOpen = {openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreated={() =>{
                    fetchAndSetEmployees();
                }}
            />
        </div>
    )
}

export default Employees