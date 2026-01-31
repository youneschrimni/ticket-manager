import { useState } from "react";
import { login } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      localStorage.setItem("accessToken", result.accessToken);
      window.location.href = "/tickets";
    } catch (err) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="navbar">
        <div className="brand">
          <strong>Ticket Manager</strong>
          <span>Connexion à votre espace</span>
        </div>
        <Link className="btn" to="/register">
          Créer un compte
        </Link>
      </div>

      <div className="card" style={{ maxWidth: 480, margin: "60px auto" }}>
        <h2>Bienvenue</h2>
        <p className="muted">
          Connectez-vous pour accéder à vos tickets et gérer vos projets.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 24 }}>
          <div>
            <label htmlFor="email" className="muted" style={{ display: 'block', marginBottom: 8 }}>
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="muted" style={{ display: 'block', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span className="muted">Pas encore de compte ? </span>
          <Link 
            to="/register" 
            style={{ 
              color: 'var(--accent-primary)', 
              fontWeight: 600,
              transition: 'color 0.2s'
            }}
          >
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}