import { useEffect, useState } from "react";
import {
  getComments,
  addComment,
  getTicketById,
  editTicket,
} from "../../services/ticket.service";
import "./TicketDetailsPanel.css";

export default function TicketDetailsPanel({
  selectedTicketId,
  selectedProjectId,
}) {
  let [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);

      try {
        const [ticketData, commentsData] = await Promise.all([
          getTicketById(selectedProjectId, selectedTicketId),
          getComments(selectedTicketId, selectedProjectId),
        ]);

        setTicket(ticketData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du ticket");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedTicketId, selectedProjectId]);

  async function handleAddComment(e) {
    e.preventDefault();
    if (!content.trim()) return;

    setError("");
    setSubmitting(true);

    try {
      const newComment = await addComment(
        selectedProjectId,
        selectedTicketId,
        content
      );
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveModifs() {
    try {
      await editTicket(ticket, selectedProjectId, ticket.id);
    }
    catch (err) {
      console.log(err)
    }
    window.location.reload();
  }


  if (loading) {
    return (
      <div className="ticket-details-panel">
        <div className="details-loading">
          <div className="spinner"></div>
          <p>Chargement du ticket...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticket-details-panel">
        <div className="details-error">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M24 16V24M24 32H24.02"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-details-panel">
      {ticket && (
        <>
          {/* Ticket Header */}
          <div className="details-header">
            <div className="header-icon">
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
                  d="M8 3V21M16 3V21M3 12H21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="header-content">
<div className="editable" data-editing={isEditingTitle ? "true" : "false"}>
  <div className="editable__display">
    <h2 className="ticket-title">{ticket.title}</h2>

    <button
      type="button"
      className="edit-icon-btn"
      onClick={() => setIsEditingTitle(true)}
      title="Modifier le titre"
      aria-label="Modifier le titre"
    >
      {/* ton SVG crayon */}
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4a2 2 0 0 0-3 0L3 14.5V20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>

  <div className="editable__editor">
    <input
      className="title-input"
      value={ticket.title ?? ""}
      onChange={(e) => setTicket(prev => ({ ...prev, title: e.target.value }))}
    />

    <div className="edit-actions">
      <button type="button" className="btn-ghost" onClick={() => setIsEditingTitle(false)}>
        Annuler
      </button>
      <button type="button" className="btn-primary" onClick={() => setIsEditingTitle(false)}>
        OK
      </button>
    </div>
  </div>
</div>


              <div className="ticket-meta">
                {ticket.createdAt && (
                  <span className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 4V8L10.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <h3>Description</h3>
          <div className="editable" data-editing={isEditingDesc ? "true" : "false"}>
          <div className="editable__display">
            <p className="description-text">
              {ticket.description || "Pas de description disponible"}
            </p>

            <button
              type="button"
              className="edit-icon-btn"
              onClick={() => setIsEditingDesc(true)}
              title="Modifier la description"
              aria-label="Modifier la description"
            >
              {/* SVG crayon */}
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4a2 2 0 0 0-3 0L3 14.5V20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="editable__editor">
            <textarea
              className="desc-textarea"
              value={ticket.description ?? ""}
              onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le ticket..."
            />

            <div className="edit-actions">
              <button type="button" className="btn-ghost" onClick={() => setIsEditingDesc(false)}>
                Annuler
              </button>
              <button type="button" className="btn-primary" onClick={() => setIsEditingDesc(false)}>
                OK
              </button>
            </div>
          </div>
        </div>


          <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priorité
            </label>
            <select
              id="priority"
              className="form-select"
              value={ticket.priority}
              onChange={(e) => setTicket((prev) => ({ ...prev, priority: e.target.value }))}
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
              value={ticket.status}
              onChange={(e) => setTicket((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>
        </div>


          {/* Comments Section */}
          <div className="details-section">
            <div className="section-header">
              <h3 className="section-title">
                Commentaires
                {comments.length > 0 && (
                  <span className="comment-count">{comments.length}</span>
                )}
              </h3>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 4V8M8 11H8.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </div>
            )}  

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="empty-comments">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M42 24C42 33.9411 33.9411 42 24 42C20.5207 42 17.2414 41.0621 14.4 39.4L6 42L8.6 33.6C6.93788 30.7586 6 27.4793 6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                  />
                </svg>
                <p>Aucun commentaire pour le moment</p>
                <span>Soyez le premier à commenter</span>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {(comment.user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.user?.name || comment.user?.email || "Utilisateur"}
                        </span>
                        {comment.createdAt && (
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        )}
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <div className="add-comment-section">
              <h4 className="add-comment-title">Ajouter un commentaire</h4>
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  className="comment-textarea"
                  placeholder="Écrivez votre commentaire..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={4}
                  maxLength={500}
                />
                <div className="comment-form-footer">
                  <span className="char-count">
                    {content.length}/500 caractères
                  </span>
                  <button
                    className="btn-submit-comment"
                    type="submit"
                    disabled={submitting || !content.trim()}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-small"></span>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M16.5 1.5L8.25 9.75M16.5 1.5L11.25 16.5L8.25 9.75M16.5 1.5L1.5 6.75L8.25 9.75"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Envoyer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div>
          <div className="save-bar">
            <button
              type="button"
              className="save-changes-btn"
              onClick={saveModifs}
            >
              Enregistrer les modifications
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}