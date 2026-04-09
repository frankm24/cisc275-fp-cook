import { useState, useCallback } from "react";
import type { Project, DrafterPage, Route, StateModel } from "../types";
import { saveProject, deleteProject } from "../storage";
import { PageGraph } from "./PageGraph";
import { PageEditor } from "./PageEditor";
import { StateEditor } from "./StateEditor";
import { CodeExport } from "./CodeExport";
import { makeId } from "../types";

type Tab = "graph" | "page" | "state" | "export";

interface ProjectEditorProps {
    project: Project;
    onBack: () => void;
    onUpdate: (project: Project) => void;
}

export function ProjectEditor({
    project,
    onBack,
    onUpdate,
}: ProjectEditorProps) {
    const [tab, setTab] = useState<Tab>("graph");
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [showJson, setShowJson] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importText, setImportText] = useState("");
    const [importError, setImportError] = useState("");

    function update(updates: Partial<Project>) {
        const updated = { ...project, ...updates, lastModified: Date.now() };
        onUpdate(updated);
        saveProject(updated);
    }

    function handleAddPage() {
        const name = prompt("Page name:") ?? "new_page";
        const newPage: DrafterPage = {
            id: makeId(),
            name: name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
            components: [],
            style: {},
            stateAnnotation: "",
            ifAnnotations: [],
            forAnnotations: [],
            position: {
                x: 100 + project.pages.length * 200,
                y: 100,
            },
        };
        update({ pages: [...project.pages, newPage] });
    }

    function handleDeletePage(pageId: string) {
        if (!confirm("Delete this page and its routes?")) return;
        update({
            pages: project.pages.filter((p) => p.id !== pageId),
            routes: project.routes.filter(
                (r) =>
                    r.sourcePageId !== pageId && r.targetPageId !== pageId
            ),
        });
        if (selectedPageId === pageId) setSelectedPageId(null);
    }

    function handleAddRoute(route: Route) {
        update({ routes: [...project.routes, route] });
    }

    function handleDeleteRoute(routeId: string) {
        update({
            routes: project.routes.filter((r) => r.id !== routeId),
        });
    }

    function handleUpdatePagePosition(
        pageId: string,
        position: { x: number; y: number }
    ) {
        update({
            pages: project.pages.map((p) =>
                p.id === pageId ? { ...p, position } : p
            ),
        });
    }

    function handlePageChange(updated: DrafterPage) {
        update({
            pages: project.pages.map((p) =>
                p.id === updated.id ? updated : p
            ),
        });
    }

    function handleStateChange(stateModel: StateModel) {
        update({ stateModel });
    }

    const handleSelectPage = useCallback((pageId: string | null) => {
        setSelectedPageId(pageId);
        if (pageId !== null) setTab("page");
    }, []);

    function handleExportJson() {
        const json = JSON.stringify(project, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, "_")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImport() {
        try {
            const parsed = JSON.parse(importText) as Project;
            if (
                typeof parsed.id !== "string" ||
                typeof parsed.name !== "string"
            ) {
                setImportError("Invalid project JSON");
                return;
            }
            onUpdate(parsed);
            saveProject(parsed);
            setImporting(false);
            setImportText("");
            setImportError("");
        } catch {
            setImportError("Invalid JSON format");
        }
    }

    function handleDeleteProject() {
        if (!confirm(`Delete project "${project.name}"?`)) return;
        deleteProject(project.id);
        onBack();
    }

    const selectedPage =
        project.pages.find((p) => p.id === selectedPageId) ?? null;

    const tabStyle = (t: Tab) => ({
        padding: "8px 16px",
        border: "none",
        borderBottom:
            tab === t ? "2px solid #3b82f6" : "2px solid transparent",
        background: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: tab === t ? 700 : 400,
        color: tab === t ? "#3b82f6" : "#64748b",
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                fontFamily: "sans-serif",
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "0 16px",
                    background: "#1e293b",
                    color: "white",
                    height: 52,
                    flexShrink: 0,
                }}
            >
                <button
                    onClick={onBack}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 18,
                        padding: "0 4px",
                    }}
                    title="Back to dashboard"
                >
                    ←
                </button>
                <span
                    style={{
                        color: "#60a5fa",
                        fontWeight: 700,
                        fontSize: 16,
                    }}
                >
                    Drafter Drafter
                </span>
                <span style={{ color: "#475569" }}>/</span>
                <input
                    value={project.name}
                    onChange={(e) => update({ name: e.target.value })}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        fontSize: 15,
                        fontWeight: 600,
                        outline: "none",
                        flex: 1,
                        maxWidth: 300,
                    }}
                />
                <div style={{ flex: 1 }} />
                <button
                    onClick={() => setImporting(!importing)}
                    style={{
                        background: "#334155",
                        color: "#e2e8f0",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                    }}
                >
                    Import JSON
                </button>
                <button
                    onClick={handleExportJson}
                    style={{
                        background: "#334155",
                        color: "#e2e8f0",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                    }}
                >
                    Export JSON
                </button>
                <button
                    onClick={handleDeleteProject}
                    style={{
                        background: "#7f1d1d",
                        color: "#fca5a5",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                    }}
                >
                    Delete Project
                </button>
            </div>

            {/* Import panel */}
            {importing && (
                <div
                    style={{
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                        padding: "12px 16px",
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        flexShrink: 0,
                    }}
                >
                    <textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Paste project JSON here..."
                        rows={3}
                        style={{
                            flex: 1,
                            padding: "8px 10px",
                            border: "1px solid #cbd5e1",
                            borderRadius: 6,
                            fontSize: 12,
                            fontFamily: "monospace",
                            resize: "vertical",
                            outline: "none",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                        }}
                    >
                        <button
                            onClick={handleImport}
                            style={{
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "8px 14px",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            Import
                        </button>
                        <button
                            onClick={() => {
                                setImporting(false);
                                setImportText("");
                                setImportError("");
                            }}
                            style={{
                                background: "#e2e8f0",
                                color: "#475569",
                                border: "none",
                                borderRadius: 6,
                                padding: "8px 14px",
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            Cancel
                        </button>
                        {importError.length > 0 && (
                            <div style={{ color: "#ef4444", fontSize: 12 }}>
                                {importError}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Purpose bar */}
            <div
                style={{
                    background: "#f1f5f9",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "6px 16px",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
                <span
                    style={{
                        fontSize: 12,
                        color: "#64748b",
                        whiteSpace: "nowrap",
                    }}
                >
                    Purpose:
                </span>
                <input
                    value={project.purpose}
                    onChange={(e) => update({ purpose: e.target.value })}
                    placeholder="Describe what your app does..."
                    style={{
                        flex: 1,
                        padding: "4px 8px",
                        border: "1px solid #cbd5e1",
                        borderRadius: 5,
                        fontSize: 13,
                        outline: "none",
                        background: "white",
                    }}
                />
                <button
                    onClick={() => setShowJson(!showJson)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 11,
                    }}
                >
                    {showJson ? "Hide JSON" : "Show JSON"}
                </button>
            </div>

            {/* Tab bar */}
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #e2e8f0",
                    background: "white",
                    flexShrink: 0,
                    paddingLeft: 8,
                }}
            >
                <button
                    style={tabStyle("graph")}
                    onClick={() => setTab("graph")}
                >
                    🗺️ Graph
                </button>
                <button
                    style={tabStyle("page")}
                    onClick={() => {
                        setTab("page");
                        if (
                            selectedPageId === null &&
                            project.pages.length > 0
                        ) {
                            setSelectedPageId(project.pages[0].id);
                        }
                    }}
                >
                    📄 Page Editor{" "}
                    {selectedPage !== null
                        ? `(${selectedPage.name})`
                        : ""}
                </button>
                <button
                    style={tabStyle("state")}
                    onClick={() => setTab("state")}
                >
                    🗃️ State Model
                </button>
                <button
                    style={tabStyle("export")}
                    onClick={() => setTab("export")}
                >
                    🐍 Code & Export
                </button>
            </div>

            {/* Tab content */}
            <div
                style={{
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {showJson && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 320,
                            height: "100%",
                            background: "#0f172a",
                            color: "#e2e8f0",
                            overflow: "auto",
                            zIndex: 50,
                            padding: 16,
                            borderLeft: "1px solid #1e293b",
                        }}
                    >
                        <pre
                            style={{
                                fontSize: 11,
                                margin: 0,
                                fontFamily: "monospace",
                            }}
                        >
                            {JSON.stringify(project, null, 2)}
                        </pre>
                    </div>
                )}

                {tab === "graph" && (
                    <PageGraph
                        pages={project.pages}
                        routes={project.routes}
                        selectedPageId={selectedPageId}
                        onSelectPage={handleSelectPage}
                        onAddPage={handleAddPage}
                        onDeletePage={handleDeletePage}
                        onAddRoute={handleAddRoute}
                        onDeleteRoute={handleDeleteRoute}
                        onUpdatePagePosition={handleUpdatePagePosition}
                    />
                )}

                {tab === "page" && (
                    <div style={{ display: "flex", height: "100%" }}>
                        {/* Page list sidebar */}
                        <div
                            style={{
                                width: 180,
                                borderRight: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                overflowY: "auto",
                                padding: "8px 0",
                                flexShrink: 0,
                            }}
                        >
                            <div
                                style={{
                                    padding: "4px 12px 8px",
                                    fontSize: 11,
                                    color: "#94a3b8",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                Pages
                            </div>
                            {project.pages.map((page) => (
                                <div
                                    key={page.id}
                                    onClick={() =>
                                        setSelectedPageId(page.id)
                                    }
                                    style={{
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        background:
                                            selectedPageId === page.id
                                                ? "#dbeafe"
                                                : "transparent",
                                        borderLeft:
                                            selectedPageId === page.id
                                                ? "3px solid #3b82f6"
                                                : "3px solid transparent",
                                        fontSize: 13,
                                        color: "#1e293b",
                                        fontWeight:
                                            selectedPageId === page.id
                                                ? 600
                                                : 400,
                                    }}
                                >
                                    {page.name}
                                </div>
                            ))}
                            {project.pages.length === 0 && (
                                <div
                                    style={{
                                        padding: "16px 12px",
                                        color: "#94a3b8",
                                        fontSize: 12,
                                    }}
                                >
                                    No pages. Add them in the Graph tab.
                                </div>
                            )}
                        </div>

                        {/* Page editor */}
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            {selectedPage !== null ? (
                                <PageEditor
                                    page={selectedPage}
                                    onChange={handlePageChange}
                                />
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                        color: "#94a3b8",
                                        fontSize: 14,
                                    }}
                                >
                                    Select a page from the list or add
                                    pages in the Graph tab.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === "state" && (
                    <StateEditor
                        stateModel={project.stateModel}
                        onChange={handleStateChange}
                    />
                )}

                {tab === "export" && <CodeExport project={project} />}
            </div>
        </div>
    );
}
