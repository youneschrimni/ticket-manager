import "./navbar.css";

export default function Navbar() {
  function logout() {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 3V21M16 3V21M3 12H21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">Ticket Manager</span>
            <span className="brand-subtitle">Tableau de bord</span>
          </div>
        </div>

        <div className="navbar-actions">

          <div className="navbar-divider"></div>

          <button
            className="navbar-btn navbar-btn-logout"
            onClick={logout}
            title="Se déconnecter"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3333 14.1667L17.5 10L13.3333 5.83334"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 10H7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}