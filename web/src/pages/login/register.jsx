import { useState } from "react";
import { register } from "../../services/auth.service";
import { Link } from "react-router-dom";
import "./auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(email, password);
      setSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Échec de l'inscription");
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
          <h1>Créer un compte, démarrer proprement.</h1>
          <p>
            Mets en place une base claire dès le départ : projets, rôles, tickets,
            et suivi.
          </p>

          <div className="bullets">
            <div><span />Structure projet + visibilité</div>
            <div><span />Gestion des tickets par priorité</div>
            <div><span />Flux de travail simple et efficace</div>
          </div>
        </div>

        <div className="footer-note">
          Les accès aux projets dépendent de l’appartenance et du rôle.
        </div>
      </div>

      <div className="auth__right">
        <div className="panel">
          <h2 className="panel__title">Inscription</h2>
          <p className="panel__subtitle">
            Crée ton compte pour commencer à gérer tes tickets.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
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
                autoComplete="new-password"
                minLength={6}
              />
              <p className="hint">Minimum 6 caractères</p>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <div className="switch">
            Déjà un compte ? <Link to="/">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
