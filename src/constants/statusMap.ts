import { projects as stringsProjects } from "./strings.json"

export const statusClassMap: Record<string, string> = {
    [stringsProjects.completed]: "completed",
    [stringsProjects.planned]: "notStarted",
    [stringsProjects.available]: "inProgress",
    [stringsProjects.unavailable]: "invalid",
    [stringsProjects.finished]: "finished"
}

export const statusMap: Record<string, string> = {
    [stringsProjects.completed]: "Concluído",
    [stringsProjects.planned]: "Planejado",
    [stringsProjects.available]: "Ativo",
    [stringsProjects.unavailable]: "Inválido",
    [stringsProjects.finished]: "Inconcluído"
}