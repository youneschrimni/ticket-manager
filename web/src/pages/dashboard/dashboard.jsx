import { useState } from "react";
import "./dashboard.css";
import Project from "../../composants/project/project";
import Navbar from "../../composants/navbar/navbar";
import Tickets from "../../composants/ticket/tickets";


export default function Dashboard() {
    const [selectedProjectId, setSelectedProjectId] = useState("");

  return (
    <div className="container">
      <Project 
      selectedProjectId= {selectedProjectId}
      onSelectProject={setSelectedProjectId}
      />
      <div className="secondBlock">
        <Navbar/>
        <Tickets selectedProjectId= {selectedProjectId}/>
      </div>
    </div>
  );
}
