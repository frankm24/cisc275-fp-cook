import { useState } from "react";
import type { Project } from "../types";
import { loadProjects, saveProject, deleteProject } from "../storage";
import { demoProject1, demoProject2 } from "../demoProjects";
import { makeId } from "../types";

interface DashboardProps {
    onOpenProject: (id: string) => void;
}

export function Dashboard({ onOpenProject }: DashboardProps) {
    const [projects, setProjects] = useState<Project[]>(loadProjects());
    const [newName, setNewName] = useState("");
    const [newPurpose, setNewPurpose] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    function refresh() {
        setProjects(loadProjects());
    }

    function handleCreate() {
        if (newName.trim().length === 0) return;
        const project: Project = {
            id: makeId(),
            name: newName.trim(),
            purpose: newPurpose.trim(),
            pages: [],
            routes: [],
            stateModel: { primaryAttributes: [], secondaryDataclasses: [] },
            lastModified: Date.now(),
        };
        saveProject(project);
        setNewName("");
        setNewPurpose("");
        setShowCreate(false);
        refresh();
    }

    function handleDelete(id: string) {
        if (!confirm("Delete this project?")) return;
        deleteProject(id);
        refresh();
    }

    function loadDemo(demo: Project) {
        const copy = { ...demo, id: makeId(), lastModified: Date.now() };
        saveProject(copy);
        refresh();
    }

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
            <div
                style={{
                    width: 240,
                    background: "#1e293b",
                    color: "#f1f5f9",
                    padding: "24px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa" }}>
                    Drafter Drafter
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                    Plan your Drafter web app
                </div>
                <hr style={{ borderColor: "#334155", margin: "8px 0" }} />
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    + New Project
                </button>
                <button
                    onClick={() => loadDemo(demoProject1)}
                    style={{
                        background: "#475569",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 13,
                    }}
                >
                    Load Demo: Todo App
                </button>
                <button
                    onClick={() => loadDemo(demoProject2)}
                    style={{
                        background: "#475569",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 13,
                    }}
                >
                    Load Demo: Blog Platform
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    padding: 32,
                    background: "#f8fafc",
                    overflowY: "auto",
                }}
            >
                <h1 style={{ margin: "0 0 8px", color: "#1e293b" }}>
                    My Projects
                </h1>
                <p style={{ color: "#64748b", marginBottom: 24 }}>
                    Select a project to start planning your Drafter web
                    application.
                </p>

                {showCreate && (
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: 10,
                            padding: 20,
                            marginBottom: 24,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <h3
                            style={{ margin: "0 0 12px", color: "#1e293b" }}
                        >
                            Create New Project
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Project name"
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: 6,
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />
                            <textarea
                                value={newPurpose}
                                onChange={(e) =>
                                    setNewPurpose(e.target.value)
                                }
                                placeholder="Project purpose (optional)"
                                rows={2}
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: 6,
                                    fontSize: 14,
                                    resize: "vertical",
                                    outline: "none",
                                    fontFamily: "inherit",
                                }}
                            />
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={handleCreate}
                                    style={{
                                        background: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowCreate(false)}
                                    style={{
                                        background: "#e2e8f0",
                                        color: "#475569",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {projects.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 60,
                            color: "#94a3b8",
                            border: "2px dashed #e2e8f0",
                            borderRadius: 12,
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 12 }}>
                            📋
                        </div>
                        <div style={{ fontSize: 16 }}>No projects yet.</div>
                        <div style={{ fontSize: 13, marginTop: 6 }}>
                            Create a new project or load a demo to get
                            started.
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 16,
                        }}
                    >
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    background: "white",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 10,
                                    padding: 20,
                                    boxShadow:
                                        "0 1px 4px rgba(0,0,0,0.06)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 16,
                                        color: "#1e293b",
                                    }}
                                >
                                    {project.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#64748b",
                                        flex: 1,
                                        minHeight: 36,
                                    }}
                                >
                                    {project.purpose.length > 0 ? (
                                        project.purpose.slice(0, 80) +
                                        (project.purpose.length > 80
                                            ? "…"
                                            : "")
                                    ) : (
                                        <em>No description</em>
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#94a3b8",
                                    }}
                                >
                                    {project.pages.length} page
                                    {project.pages.length !== 1 ? "s" : ""}{" "}
                                    ·{" "}
                                    {project.routes.length} route
                                    {project.routes.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    · Modified{" "}
                                    {new Date(
                                        project.lastModified
                                    ).toLocaleDateString()}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        marginTop: 4,
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            onOpenProject(project.id)
                                        }
                                        style={{
                                            flex: 1,
                                            background: "#3b82f6",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "7px 0",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            fontSize: 13,
                                        }}
                                    >
                                        Open
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(project.id)
                                        }
                                        style={{
                                            background: "#fee2e2",
                                            color: "#ef4444",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "7px 12px",
                                            cursor: "pointer",
                                            fontSize: 13,
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
