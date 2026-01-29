import { apiFetch } from "../api/api";

export function getTickets() {
  return apiFetch("/tickets");
}

export function createTicket(ticket) {
  return apiFetch("/tickets", {
    method: "POST",
    body: JSON.stringify(ticket),
  });
}

export function getTicketById(id) {
  return apiFetch(`/tickets/${id}`);
}

export function getComments(ticketId) {
  return apiFetch(`/tickets/${ticketId}/comments`);
}

export function addComment(ticketId, content) {
  return apiFetch(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
