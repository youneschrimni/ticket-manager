import { apiFetch } from "../api/api";

export function getProject() {
    return apiFetch("/projects")
}

export function createProject(project) {
    return apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(project)
    })
}

export function deleteProject(id) {
    return apiFetch(`/projects/${id}`, {method: "DELETE"})
}