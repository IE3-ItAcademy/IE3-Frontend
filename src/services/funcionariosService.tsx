export async function fetchEmployees() {
  const response = await fetch('http://localhost:8080/api/employees');
  if (!response.ok) throw new Error('Erro ao buscar funcionários');
  return response.json();
}

export async function fetchEmployeeModal(id: number) {
  const response = await fetch(`http://localhost:8080/api/employees/modal/${id}`);
  if(!response.ok) throw new Error('Erro ao buscar detalhes do funcionário');
  return response.json();
}