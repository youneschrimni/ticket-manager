import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById, getComments, addComment } from "../services/ticket.service";

export default function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const t = await getTicketById(id);
        setTicket(t);

        const c = await getComments(id);
        setComments(c);
      } catch (err) {
        setError(err.message || "Erreur chargement ticket");
      }
    }
    load();
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");

    try {
      const newComment = await addComment(id, content);
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err.message || "Erreur ajout commentaire");
    }
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/tickets">Retour</Link>
      </div>
    );
  }

  if (!ticket) return <p>Chargement...</p>;

return (
  <div className="container">
    <div className="navbar">
      <div className="brand">
        <strong>Ticket Manager</strong>
        <span>Détails du ticket</span>
      </div>
      <Link className="btn" to="/tickets">Retour</Link>
    </div>

    {error && <div className="alert">{error}</div>}

    {!ticket ? (
      <p>Chargement...</p>
    ) : (
      <div className="grid">
        <div className="card">
          <h2>{ticket.title}</h2>
          <p className="muted">{ticket.description}</p>

          <div className="badges" style={{ justifyContent: "flex-start" }}>
            <span className="badge badge-primary">{ticket.status}</span>
            <span className="badge">{ticket.priority}</span>
            <span className="badge">{ticket.type}</span>
          </div>
        </div>

        <div className="card">
          <h3>Commentaires</h3>

          <ul className="list">
            {comments.map((c) => (
              <li key={c.id} className="item">
                <div>
                  <strong>{c.user?.email}</strong>
                  <div className="muted">{c.content}</div>
                </div>
              </li>
            ))}
          </ul>

          <h4 style={{ marginTop: 16 }}>Ajouter un commentaire</h4>
          <form onSubmit={handleAddComment} className="grid" style={{ gap: 12 }}>
            <textarea
              className="textarea"
              placeholder="Ton commentaire…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn btn-primary">Envoyer</button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
