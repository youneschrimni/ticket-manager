import { useEffect, useState } from "react";
import { createProject, deleteProject, getProject } from "../../services/project.service";
import "./project.css";

export default function Project({ selectedProjectId, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try { 
        const result = await getProject();
        if (cancelled) return;

        setProjects(result);

        if (!selectedProjectId && result?.length) {
          onSelectProject(result[0].id);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Erreur lors du chargement des projets", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setError("");
      const created = await createProject({ name: name.trim() });
      setProjects((prev) => [...prev, created]);
      setName("");
      setIsCreating(false);
      onSelectProject(created.id);
    } catch (err) {
      setError("Erreur lors de la création du projet", err);
    }
  }

  function handleCancel() {
    setIsCreating(false);
    setName("");
    setError("");
  }

async function handleDeleteProject(projectId) {
  const ok = window.confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.");
  if (!ok) return;

  try {
    setError("");
    await deleteProject(projectId).then(()=>{
          setProjects(prev => prev.filter(p => p.id !== projectId));

    if (selectedProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      onSelectProject(remaining[0]?.id || null);

    if( remaining.length==0 ) {
        onSelectProject("");
      }
    }

    });
  } catch (err) {
    setError(err.message || "Suppression impossible");
  }
}

  return (
    <div className="project-sidebar">
      <div className="project-header">
        <h2 className="project-title">Projets</h2>
        {!isCreating && (
          <button
            className="btn-new-project"
            onClick={() => setIsCreating(true)}
            title="Créer un nouveau projet"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3.5V12.5M3.5 8H12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="project-error" role="alert">
          {error}
        </div>
      )}

      {isCreating && (
        <form className="project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            className="project-input"
            placeholder="Nom du projet..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={50}
          />
          <div className="project-form-actions">
            <button type="submit" className="btn-submit" disabled={!name.trim()}>
              Créer
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="project-list">
        {loading ? (
          <div className="project-loading">Chargement...</div>
        ) : projects.length === 0 ? (
          <div className="project-empty">
            <p>Aucun projet</p>
            <button
              className="btn-create-first"
              onClick={() => setIsCreating(true)}
            >
              Créer votre premier projet
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`project-item ${
                selectedProjectId === project.id ? "active" : ""
              }`}
            >
              <div className="project-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="14"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 2V16M12 2V16M2 9H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="project-name">{project.name}</span>
              <span className="project-count">
                      <div
                        className="btn-delete"
                        onClick={() => handleDeleteProject(project.id)}
                        title="Supprimer"
                      >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M2 4H14M6 4V2.66667C6 2.48986 6.07024 2.32029 6.19526 2.19526C6.32029 2.07024 6.48986 2 6.66667 2H9.33333C9.51014 2 9.67971 2.07024 9.80474 2.19526C9.92976 2.32029 10 2.48986 10 2.66667V4M12.6667 4V13.3333C12.6667 13.5101 12.5964 13.6797 12.4714 13.8047C12.3464 13.9298 12.1768 14 12 14H4C3.82319 14 3.65362 13.9298 3.5286 13.8047C3.40357 13.6797 3.33333 13.5101 3.33333 13.3333V4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                {/* Vous pouvez ajouter le nombre de tickets ici */}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}