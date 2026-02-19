import { useEffect, useMemo, useState } from "react";
import {
  getTickets,
  deleteTicketById,
  getMembers,
} from "../../services/ticket.service";
import "./ticket.css";
import TicketCreatePanel from "../TicketCreatePanel/TicketCreatePanel";
import TicketDetailsPanel from "../TicketDetailsPanel/TicketDetailsPanel";

export default function Tickets({ selectedProjectId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [members, setMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    if (!selectedProjectId) return;

    async function load() {
      setLoading(true);
      try {
        const [data, allMembers] = await Promise.all([
          getTickets(selectedProjectId),
          getMembers(selectedProjectId),
        ]);
        setTickets(data);
        setMembers(allMembers);
        setError("");
      } catch (err) {
        setError(err.message || "Impossible de charger les tickets");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedProjectId]);

  async function handleDeleteTicket(e, id) {
    e.stopPropagation();

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) return;

    try {
      await deleteTicketById(id, selectedProjectId);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      if (selectedTicketId === id) setSelectedTicketId(null);
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du ticket");
    }
  }

  function handleTicketClick(ticketId) {
    setSelectedTicketId(ticketId);
    setShowCreatePanel(false);
  }

  function handleCreateNew() {
    setShowCreatePanel(true);
    setSelectedTicketId(null);
  }

  function closeModal() {
    setShowCreatePanel(false);
    setSelectedTicketId(null);
  }

  const normalizeStatus = (status) => {
    const s = (status || "").toString().trim().toLowerCase();

    if (s === "open") return "OPEN";
    if (s === "in_progress" || s === "in progress" || s === "inprogress") return "IN_PROGRESS";
    if (s === "resolved" || s === "done" || s === "fixed") return "RESOLVED";
    if (s === "closed") return "CLOSED";

    if (s === "ouvert") return "OPEN";
    if (s === "en_cours" || s === "en cours") return "IN_PROGRESS";
    if (s === "résolu" || s === "resolu") return "RESOLVED";
    if (s === "fermé" || s === "ferme") return "CLOSED";

    const upper = s.toUpperCase();
    if (["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(upper)) return upper;

    return "OPEN";
  };

  const getStatusBadgeClass = (status) => {
    const canonical = normalizeStatus(status);
    const map = {
      OPEN: "badge-status-open",
      IN_PROGRESS: "badge-status-progress",
      RESOLVED: "badge-status-resolved",
      CLOSED: "badge-status-closed",
    };
    return map[canonical] || "badge-status-open";
  };

  const getPriorityBadgeClass = (priority) => {
    const map = {
      urgent: "badge-priority-urgent",
      high: "badge-priority-high",
      medium: "badge-priority-medium",
      low: "badge-priority-low",
      élevée: "badge-priority-high",
      moyenne: "badge-priority-medium",
      basse: "badge-priority-low",
    };
    return map[priority?.toLowerCase()] || "badge-priority-medium";
  };

  const getStatusLabel = (status) => {
    const canonical = normalizeStatus(status);
    const labels = {
      OPEN: "Ouvert",
      IN_PROGRESS: "En cours",
      RESOLVED: "Résolu",
      CLOSED: "Fermé",
    };
    return labels[canonical] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      urgent: "Urgent",
      high: "Élevée",
      medium: "Moyenne",
      low: "Basse",
      élevée: "Élevée",
      moyenne: "Moyenne",
      basse: "Basse",
    };
    return labels[priority?.toLowerCase()] || priority;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch =
      filterStatus === "all" ||
      normalizeStatus(ticket.status) === normalizeStatus(filterStatus);

    const priorityMatch =
      filterPriority === "all" ||
      ticket.priority?.toLowerCase() === filterPriority.toLowerCase();

    return statusMatch && priorityMatch;
  });

  const STATUS_COLUMNS = useMemo(
    () => [
      { key: "OPEN", label: "Ouvert", dotClass: "dot-open" },
      { key: "IN_PROGRESS", label: "En cours", dotClass: "dot-progress" },
      { key: "RESOLVED", label: "Résolu", dotClass: "dot-resolved" },
      { key: "CLOSED", label: "Fermé", dotClass: "dot-closed" },
    ],
    []
  );

  const ticketsByStatus = useMemo(() => {
    const base = { OPEN: [], IN_PROGRESS: [], RESOLVED: [], CLOSED: [] };
    for (const t of filteredTickets) {
      const st = normalizeStatus(t.status);
      (base[st] || base.OPEN).push(t);
    }
    return base;
  }, [filteredTickets]);

  const projectName = members.length > 0 ? members[0].project.name : "";

  const isModalOpen = showCreatePanel || !!selectedTicketId;

  return (
    <div className="tickets-container">
      {/* Header */}
      <div className="tickets-header">
        <div className="header-top">
          <div className="header-title-section">
            <h1 className="project-title">{projectName || "Projet"}</h1>
            <div className="ticket-count-badge">
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
            </div>
          </div>

          <button className="btn-primary" onClick={handleCreateNew}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4.16667V15.8333M4.16667 10H15.8333"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Nouveau ticket
          </button>
        </div>

        {/* Members */}
        {members.length > 0 && (
          <div className="members-section">
            <span className="members-label">Membres du projet</span>
            <div className="members-list">
              {members.map((m) => (
                <div className="member-avatar" key={m.user.id || m.user.email}>
                  <span>{(m.user.name || m.user.email).charAt(0).toUpperCase()}</span>
                  <div className="member-tooltip">{m.user.name || m.user.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Priorité</label>
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Board full width */}
      <div className="tickets-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect
                x="8"
                y="8"
                width="48"
                height="48"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M20 28H44M20 36H36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
            <h3>Aucun ticket trouvé</h3>
            <p>
              {tickets.length === 0
                ? "Créez votre premier ticket pour commencer"
                : "Aucun ticket ne correspond aux filtres sélectionnés"}
            </p>
            {tickets.length === 0 && (
              <button className="btn-secondary" onClick={handleCreateNew}>
                Créer un ticket
              </button>
            )}
          </div>
        ) : (
          <div className="kanban-board">
            {STATUS_COLUMNS.map((col) => {
              const colTickets = ticketsByStatus[col.key] || [];
              return (
                <section key={col.key} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <span className={`kanban-dot ${col.dotClass}`} />
                      <h3 className="kanban-title">{col.label}</h3>
                    </div>
                    <span className="kanban-count">{colTickets.length}</span>
                  </div>

                  <div className="kanban-column-body">
                    {colTickets.length === 0 ? (
                      <div className="kanban-empty">Aucun ticket</div>
                    ) : (
                      colTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`ticket-card kanban-ticket-card ${
                            selectedTicketId === ticket.id ? "active" : ""
                          }`}
                          onClick={() => handleTicketClick(ticket.id)}
                        >
                          <div className="ticket-header">
                            <h3 className="ticket-title">{ticket.title}</h3>
                            <button
                              className="btn-delete"
                              onClick={(e) => handleDeleteTicket(e, ticket.id)}
                              title="Supprimer"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M2 4H14M6 4V2.66667C6 2.48986 6.07024 2.32029 6.19526 2.19526C6.32029 2.07024 6.48986 2 6.66667 2H9.33333C9.51014 2 9.67971 2.07024 9.80474 2.19526C9.92976 2.32029 10 2.48986 10 2.66667V4M12.6667 4V13.3333C12.6667 13.5101 12.5964 13.6797 12.4714 13.8047C12.3464 13.9298 12.1768 14 12 14H4C3.82319 14 3.65362 13.9298 3.5286 13.8047C3.40357 13.6797 3.33333 13.5101 3.33333 13.3333V4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>

                          <p className="ticket-description">
                            {ticket.description?.slice(0, 120) || "Pas de description"}
                            {ticket.description?.length > 120 ? "..." : ""}
                          </p>

                          <div className="ticket-footer">
                            <div className="ticket-badges">
                              <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                                {getStatusLabel(ticket.status || "OPEN")}
                              </span>
                              <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                                {getPriorityLabel(ticket.priority || "medium")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="modal-content">
              {showCreatePanel ? (
                <TicketCreatePanel selectedProjectId={selectedProjectId} />
              ) : (
                <TicketDetailsPanel
                  selectedProjectId={selectedProjectId}
                  selectedTicketId={selectedTicketId}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
