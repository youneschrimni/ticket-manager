import { useEffect, useState } from "react";
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
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      return;
    }

    try {
      await deleteTicketById(id, selectedProjectId);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      if (selectedTicketId === id) {
        setSelectedTicketId(null);
      }
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

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      open: "badge-status-open",
      in_progress: "badge-status-progress",
      closed: "badge-status-closed",
      ouvert: "badge-status-open",
      en_cours: "badge-status-progress",
      fermé: "badge-status-closed",
    };
    return statusMap[status?.toLowerCase()] || "badge-status-open";
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityMap = {
      urgent: "badge-priority-urgent",
      high: "badge-priority-high",
      medium: "badge-priority-medium",
      low: "badge-priority-low",
      élevée: "badge-priority-high",
      moyenne: "badge-priority-medium",
      basse: "badge-priority-low",
    };
    return priorityMap[priority?.toLowerCase()] || "badge-priority-medium";
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: "Ouvert",
      in_progress: "En cours",
      closed: "Fermé",
      ouvert: "Ouvert",
      en_cours: "En cours",
      fermé: "Fermé",
    };
    return labels[status?.toLowerCase()] || status;
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

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch =
      filterStatus === "all" ||
      ticket.status?.toLowerCase() === filterStatus.toLowerCase();
    const priorityMatch =
      filterPriority === "all" ||
      ticket.priority?.toLowerCase() === filterPriority.toLowerCase();
    return statusMatch && priorityMatch;
  });

  const projectName = members.length > 0 ? members[0].project.name : "";

  return (
    <div className="tickets-container">
      {/* Header Section */}
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

        {/* Members Section */}
        {members.length > 0 && (
          <div className="members-section">
            <span className="members-label">Membres du projet</span>
            <div className="members-list">
              {members.map((m) => (
                <div className="member-avatar" key={m.user.id || m.user.email}>
                  <span>{(m.user.name || m.user.email).charAt(0).toUpperCase()}</span>
                  <div className="member-tooltip">
                    {m.user.name || m.user.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="closed">Fermé</option>
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

      {/* Main Content */}
      <div className="tickets-layout">
        {/* Tickets List */}
        <div className="tickets-list-section">
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
            <div className="tickets-grid">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`ticket-card ${
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
                        {getStatusLabel(ticket.status || "open")}
                      </span>
                      <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority || "medium")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel */}
        {(showCreatePanel || selectedTicketId) && (
          <div className="tickets-panel">
            <button
              className="panel-close"
              onClick={() => {
                setShowCreatePanel(false);
                setSelectedTicketId(null);
              }}
              title="Fermer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {showCreatePanel ? (
              <TicketCreatePanel selectedProjectId={selectedProjectId} />
            ) : (
              <TicketDetailsPanel
                selectedProjectId={selectedProjectId}
                selectedTicketId={selectedTicketId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}