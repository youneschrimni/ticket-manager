import { useState } from "react";
import { login } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);

      // Ton backend renvoie: { accessToken, user }
      localStorage.setItem("accessToken", result.accessToken);

      // On redirige vers la page tickets
      window.location.href = "/tickets";
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

return (
  <div className="container">
    <div className="navbar">
      <div className="brand">
        <strong>Ticket Manager</strong>
        <span>Connexion</span>
      </div>
        <Link className="btn" to="/register">Créer un compte</Link>
    </div>

    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Se connecter</h2>
      <p className="muted">Connecte-toi pour accéder à tes tickets.</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
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

        <button className="btn btn-primary" type="submit">Se connecter</button>
      </form>
    </div>
  </div>
);
}
