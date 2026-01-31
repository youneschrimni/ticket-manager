import { useEffect, useState } from "react";
import { getTickets, createTicket } from "../services/ticket.service";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  function logout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const newTicket = await createTicket({
        title,
        description,
      });

      setTickets((prev) => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Erreur lors de la création du ticket");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message || "Impossible de charger les tickets");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'open': 'badge-primary',
      'in_progress': 'badge-warning',
      'closed': 'badge-success',
      'ouvert': 'badge-primary',
      'en_cours': 'badge-warning',
      'fermé': 'badge-success',
    };
    return statusMap[status?.toLowerCase()] || 'badge';
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

  return (
    <div className="container">
      <div className="navbar">
        <div className="brand">
          <strong>Ticket Manager</strong>
          <span>Tableau de bord</span>
        </div>
        <button className="btn btn-danger" onClick={logout}>
          Déconnexion
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="grid">
        {/* Liste des tickets */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2>Mes tickets</h2>
              <p className="muted">
                {tickets.length === 0 
                  ? "Aucun ticket pour le moment" 
                  : `${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading">Chargement des tickets</div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <h3>Aucun ticket</h3>
              <p className="muted">Créez votre premier ticket pour commencer</p>
            </div>
          ) : (
            <ul className="list">
              {tickets.map((t) => (
                <li key={t.id} className="item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong>
                      <Link to={`/tickets/${t.id}`}>{t.title}</Link>
                    </strong>
                    <span className="muted" style={{ display: 'block', marginTop: 4 }}>
                      {t.description?.slice(0, 120) || "Pas de description"}
                      {t.description?.length > 120 ? "..." : ""}
                    </span>
                  </div>

                  <div className="badges">
                    <span className={`badge ${getStatusBadgeClass(t.status)}`}>
                      {t.status || 'open'}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(t.priority)}`}>
                      {t.priority || 'medium'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulaire de création */}
        <div className="card">
          <h3>Nouveau ticket</h3>
          <p className="muted">
            Créez un ticket pour suivre vos problèmes et vos tâches.
          </p>

          <form onSubmit={handleCreate} style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="title" className="muted" style={{ display: 'block', marginBottom: 8 }}>
                Titre du ticket
              </label>
              <input
                id="title"
                className="input"
                placeholder="Ex: Corriger le bug de connexion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="description" className="muted" style={{ display: 'block', marginBottom: 8 }}>
                Description
              </label>
              <textarea
                id="description"
                className="textarea"
                placeholder="Décrivez le problème en détail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={creating}
              style={{ width: '100%' }}
            >
              {creating ? "Création..." : "Créer le ticket"}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
              💡 Astuce : Soyez précis dans votre description pour faciliter le suivi et la résolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}