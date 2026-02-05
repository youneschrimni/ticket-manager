import { useEffect, useState } from "react";
import { login } from "../../services/auth.service";
import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("loginMessage");
    if (msg) {
      setInfo(msg);
      localStorage.removeItem("loginMessage");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      localStorage.setItem("accessToken", result.accessToken);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="brand">
          <div className="brand__mark" />
          <div>
            <div className="brand__name">Ticket Manager</div>
            <span className="brand__tag">Projets, tickets, exécution</span>
          </div>
        </div>

        <div className="hero">
          <h1>Un suivi clair, une exécution rapide.</h1>
          <p>
            Centralise tes projets, priorise les tickets, et garde une vue nette
            sur l’avancement.
          </p>

          <div className="bullets">
            <div><span />Statuts, priorités, assignation</div>
            <div><span />Historique et commentaires par ticket</div>
            <div><span />Organisation par projets et rôles</div>
          </div>
        </div>

        <div className="footer-note">
          Connexion sécurisée. Accès selon rôles et appartenance aux projets.
        </div>
      </div>

      <div className="auth__right">
        <div className="panel">
          <h2 className="panel__title">Connexion</h2>
          <p className="panel__subtitle">
            Accède à ton espace pour gérer tes projets et tickets.
          </p>

          {info && <div className="alert">{info}</div>}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label htmlFor="email" className="label">Adresse email</label>
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

            <div className="field">
              <label htmlFor="password" className="label">Mot de passe</label>
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

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="switch">
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
