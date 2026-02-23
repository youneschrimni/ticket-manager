import { useState } from "react";
import "./dashboard.css";
import Project from "../../composants/project/project";
import Navbar from "../../composants/navbar/navbar";
import Tickets from "../../composants/ticket/tickets";

export default function Dashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  console.log(selectedProjectId=="")
  return (
    <div className="container">
      <Project
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />

      <div className="secondBlock">
        <Navbar />

        {selectedProjectId!="" ? (
          <Tickets selectedProjectId={selectedProjectId} />
        ) : (
          <div className="empty-state">
            <div className="empty-card">
              <h2 className="empty-title">Crée ton premier projet</h2>
              <p className="empty-text">
                Pour commencer, crée un projet dans le panneau de gauche, puis sélectionne-le
                pour afficher tes tickets.
              </p>

              <div className="empty-hint">
                <span className="hint-dot" aria-hidden="true" />
                <span>Tu pourras ensuite créer, assigner et suivre l’avancement.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}