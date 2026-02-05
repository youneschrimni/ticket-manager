import { useState } from "react";
import { createTicket } from "../../services/ticket.service";
import "./TicketCreatePanel.css";

export default function TicketCreatePanel({ selectedProjectId }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("OPEN");

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setCreating(true);

    try {
      await createTicket({ title, description, priority, status }, selectedProjectId);
      setSuccess(true);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus("OPEN");

      setTimeout(() => setSuccess(false), 3000);
      window.location.reload();
    } catch (err) {
      setError(err.message || "Erreur lors de la création du ticket");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="ticket-create-panel">
      <div className="panel-header">
        <div className="panel-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 12H16M12 8V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="panel-title">Nouveau ticket</h3>
          <p className="panel-subtitle">
            Créez un ticket pour suivre vos problèmes et tâches
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M10 6V10M10 14H10.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M6 10L9 13L14 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Ticket créé avec succès !
        </div>
      )}

      <form onSubmit={handleCreate} className="panel-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Titre du ticket
            <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="Ex: Corriger le bug de connexion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
          <span className="form-hint">{title.length}/100 caractères</span>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
            <span className="required">*</span>
          </label>
          <textarea
            id="description"
            className="form-textarea"
            placeholder="Décrivez le problème en détail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            maxLength={1000}
          />
          <span className="form-hint">{description.length}/1000 caractères</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priorité
            </label>
            <select
              id="priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Élevée</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Statut
            </label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>
        </div>

        <button
          className="form-submit"
          type="submit"
          disabled={creating || !title.trim() || !description.trim()}
        >
          {creating ? (
            <>
              <span className="spinner-small"></span>
              Création...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4.16667V15.8333M4.16667 10H15.8333"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Créer le ticket
            </>
          )}
        </button>
      </form>

      <div className="panel-tip">
        <div className="tip-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2.5C8.95942 2.5 7.95772 2.89509 7.21447 3.6066C6.47123 4.31811 6.04395 5.29566 6.02148 6.33333C6.02148 7.75 6.64648 8.75 7.27148 9.75C7.89648 10.75 8.52148 11.75 8.52148 13.3333H11.4715C11.4715 11.75 12.0965 10.75 12.7215 9.75C13.3465 8.75 13.9715 7.75 13.9715 6.33333C13.9492 5.29566 13.5219 4.31811 12.7787 3.6066C12.0354 2.89509 11.0337 2.5 9.99316 2.5H10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.125 16.6667H11.875M10 2.5V1.66667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <strong>Astuce</strong>
          <p>
            Soyez précis dans votre description pour faciliter le suivi et la
            résolution du ticket.
          </p>
        </div>
      </div>
    </div>
  );
}