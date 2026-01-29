import { useState } from "react";
import { register } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      await register(email, password);
      setOk("Compte créé. Tu peux te connecter.");
    } catch (err) {
      setError(err.message || "Register failed");
    }
  }

return (
  <div className="container">
    <div className="navbar">
      <div className="brand">
        <strong>Ticket Manager</strong>
        <span>Inscription</span>
      </div>
        <Link className="btn" to="/">Se connecter</Link>
    </div>

    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Créer un compte</h2>
      <p className="muted">Crée un compte pour gérer tes tickets.</p>

      {error && <div className="alert">{error}</div>}
      {ok && <div className="alert" style={{ borderColor: "rgba(75,42,173,.4)" }}>{ok}</div>}

      <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" type="submit">Créer le compte</button>
      </form>
    </div>
  </div>
);
}
