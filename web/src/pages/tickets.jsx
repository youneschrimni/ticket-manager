import { useEffect, useState } from "react";
import { getTickets, createTicket } from "../services/ticket.service";
import { Link } from "react-router-dom";

export default function Tickets() {

  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function logout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      const newTicket = await createTicket({
        title,
        description,
      });

      setTickets((prev) => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Erreur création ticket");
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message || "Impossible de charger les tickets");
      }
    }
    load();
  }, []);

return (
  <div className="container">
    <div className="navbar">
      <div className="brand">
        <strong>Ticket Manager</strong>
        <span className="muted">Dashboard</span>
      </div>
      <button className="btn btn-danger" onClick={logout}>Logout</button>
    </div>

    {error && <div className="alert">{error}</div>}

    <div className="grid">
      <div className="card">
        <h2>Mes tickets</h2>
        <p className="muted">Clique sur un ticket pour voir les détails et les commentaires.</p>

        <ul className="list">
          {tickets.map((t) => (
            <li key={t.id} className="item">
              <div>
                <strong>
                  <Link to={`/tickets/${t.id}`}>{t.title}</Link>
                </strong>
                <span className="muted">{t.description?.slice(0, 90) || ""}</span>
              </div>

              <div className="badges">
                <span className="badge badge-primary">{t.status}</span>
                <span className="badge">{t.priority}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Nouveau ticket</h3>
        <p className="muted">Décris le problème clairement pour le retrouver facilement.</p>

        <form onSubmit={handleCreate} className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
          <input
            className="input"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">Créer</button>
        </form>
      </div>
    </div>
  </div>
);
}
