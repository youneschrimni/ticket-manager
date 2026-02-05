import { apiFetch } from "../api/api";

export function getTickets(projectId) {
  return apiFetch(`/projects/${projectId}/tickets`);
}

export function getTicketById(projectId, ticketId) {
  return apiFetch(`/projects/${projectId}/tickets/${ticketId}`);
}

export function createTicket(ticket, projectId) {
  return apiFetch(`/projects/${projectId}/tickets`, {
    method: "POST",
    body: JSON.stringify(ticket),
  });
}

export function editTicket(ticket, projectId, id) {
  return apiFetch(`/projects/${projectId}/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(ticket),
  });
}

export function getComments(ticketId, projectId) {
  return apiFetch(`/projects/${projectId}/tickets/${ticketId}/comments`);
}

export function deleteTicketById(ticketId, projectId) {
    return apiFetch(`/projects/${projectId}/tickets/${ticketId}`, {
    method: "DELETE",
  });
}

export function deleteCommentById(ticketId) {
  return apiFetch(`/tickets/${ticketId}`, {
    method: "DELETE"
  })
}

export function getMembers(projectId) {
  return apiFetch(`/members/${projectId}`)
}

export function addComment(projectId ,ticketId, content) {
  return apiFetch(`/projects/${projectId}/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

}
