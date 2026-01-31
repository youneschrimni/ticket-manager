import { useState } from "react";
import { register } from "../services/auth.service";
import { Link } from "react-router-dom";

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
      setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="navbar">
        <div className="brand">
          <strong>Ticket Manager</strong>
          <span>Créer un nouveau compte</span>
        </div>
        <Link className="btn" to="/">
          Se connecter
        </Link>
      </div>

      <div className="card" style={{ maxWidth: 480, margin: "60px auto" }}>
        <h2>Inscription</h2>
        <p className="muted">
          Créez votre compte pour commencer à gérer vos tickets efficacement.
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
              autoComplete="new-password"
              minLength={6}
            />
            <span className="muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Minimum 6 caractères
            </span>
          </div>

          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span className="muted">Vous avez déjà un compte ? </span>
          <Link 
            to="/" 
            style={{ 
              color: 'var(--accent-primary)', 
              fontWeight: 600,
              transition: 'color 0.2s'
            }}
          >
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}