import { useState } from "react";
import { loadProjects } from "./storage";
import { Dashboard } from "./components/Dashboard";
import { ProjectEditor } from "./components/ProjectEditor";
import type { Project } from "./types";
import "./App.css";

export function App() {
    const [view, setView] = useState<"dashboard" | "project">("dashboard");
    const [currentProject, setCurrentProject] = useState<Project | null>(
        null
    );

    function handleOpenProject(id: string) {
        const projects = loadProjects();
        const project = projects.find((p) => p.id === id);
        if (project === undefined) return;
        setCurrentProject(project);
        setView("project");
    }

    function handleBack() {
        setCurrentProject(null);
        setView("dashboard");
    }

    function handleUpdateProject(project: Project) {
        setCurrentProject(project);
    }

    return (
        <div className="app-root">
            {view === "dashboard" ? (
                <Dashboard onOpenProject={handleOpenProject} />
            ) : currentProject !== null ? (
                <ProjectEditor
                    project={currentProject}
                    onBack={handleBack}
                    onUpdate={handleUpdateProject}
                />
            ) : (
                <Dashboard onOpenProject={handleOpenProject} />
            )}
        </div>
    );
}

export default App;
