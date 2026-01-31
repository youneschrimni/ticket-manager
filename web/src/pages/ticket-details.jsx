import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById, getComments, addComment } from "../services/ticket.service";

export default function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);

      try {
        const t = await getTicketById(id);
        setTicket(t);

        const c = await getComments(id);
        setComments(c);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du ticket");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const newComment = await addComment(id, content);
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'open': 'badge-primary',
      'in_progress': 'badge-warning',
      'closed': 'badge-success',
      'ouvert': 'badge-primary',
      'en_cours': 'badge-warning',
      'fermé': 'badge-success',
    };
    return statusMap[status?.toLowerCase()] || 'badge-primary';
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityMap = {
      'high': 'badge-danger',
      'medium': 'badge-warning',
      'low': 'badge-success',
      'élevée': 'badge-danger',
      'moyenne': 'badge-warning',
      'basse': 'badge-success',
    };
    return priorityMap[priority?.toLowerCase()] || 'badge';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement du ticket</div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/tickets" className="btn" style={{ marginTop: 16 }}>
          Retour aux tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="navbar">
        <div className="brand">
          <strong>Ticket Manager</strong>
          <span>Détails du ticket</span>
        </div>
        <Link className="btn" to="/tickets">
          ← Retour
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {ticket && (
        <div className="grid">
          {/* Détails du ticket */}
          <div className="card">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ marginBottom: 12 }}>{ticket.title}</h2>
              
              <div className="badges" style={{ marginBottom: 16 }}>
                <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                  {ticket.status || 'open'}
                </span>
                <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                  {ticket.priority || 'medium'}
                </span>
                {ticket.type && (
                  <span className="badge">
                    {ticket.type}
                  </span>
                )}
              </div>

              <div style={{ 
                padding: 16, 
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  {ticket.description || "Pas de description disponible"}
                </p>
              </div>
            </div>

            {ticket.createdAt && (
              <div className="muted" style={{ fontSize: 12, marginTop: 16 }}>
                Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>

          {/* Section commentaires */}
          <div className="card">
            <div style={{ marginBottom: 20 }}>
              <h3>Commentaires</h3>
              <p className="muted">
                {comments.length === 0 
                  ? "Aucun commentaire pour le moment" 
                  : `${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
              </p>
            </div>

            {comments.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <p className="muted">Soyez le premier à commenter</p>
              </div>
            ) : (
              <ul className="list" style={{ marginBottom: 24 }}>
                {comments.map((c) => (
                  <li key={c.id} className="item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: 14 }}>
                        {c.user?.email || 'Utilisateur'}
                      </strong>
                      {c.createdAt && (
                        <span className="muted" style={{ fontSize: 12 }}>
                          {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {c.content}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ 
              padding: 16, 
              background: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{ marginBottom: 12 }}>Ajouter un commentaire</h4>
              <form onSubmit={handleAddComment}>
                <textarea
                  className="textarea"
                  placeholder="Votre commentaire..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{ marginBottom: 12 }}
                />
                <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%' }}
                >
                  {submitting ? "Envoi..." : "Envoyer le commentaire"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}