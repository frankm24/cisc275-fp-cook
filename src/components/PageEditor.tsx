import { useState } from "react";
import {
    DrafterPage,
    PageComponent,
    ComponentType,
    ComponentConfig,
    PageStyle,
    IfAnnotation,
    ForAnnotation,
} from "../types";
import { ComponentEditor } from "./ComponentEditor";
import { makeId } from "../types";

interface PageEditorProps {
    page: DrafterPage;
    onChange: (updated: DrafterPage) => void;
}

function defaultConfig(type: ComponentType): ComponentConfig {
    switch (type) {
        case "Text":
            return { content: "New text" };
        case "Header":
            return { content: "New Header", level: 1 };
        case "TextBox":
            return { name: "field", defaultValue: "" };
        case "TextArea":
            return { name: "field", defaultValue: "" };
        case "CheckBox":
            return { name: "checkbox", defaultValue: false };
        case "SelectBox":
            return {
                name: "select",
                options: ["Option 1", "Option 2"],
                defaultValue: "Option 1",
            };
        case "Button":
            return { label: "Click me", route: "index" };
    }
}

function componentPreview(comp: PageComponent): string {
    const cfg = comp.config;
    if ("content" in cfg) return `${comp.type}: ${String(cfg.content).slice(0, 30)}`;
    if ("label" in cfg) return `Button: ${String(cfg.label)}`;
    if ("name" in cfg) return `${comp.type}: ${String(cfg.name)}`;
    return comp.type;
}

export function PageEditor({ page, onChange }: PageEditorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [addType, setAddType] = useState<ComponentType>("Text");

    const selectedComp =
        page.components.find((c) => c.id === selectedId) ?? null;

    function updatePage(updates: Partial<DrafterPage>) {
        onChange({ ...page, ...updates });
    }

    function addComponent() {
        const newComp: PageComponent = {
            id: makeId(),
            type: addType,
            config: defaultConfig(addType),
            style: {},
        };
        updatePage({ components: [...page.components, newComp] });
        setSelectedId(newComp.id);
    }

    function updateComponent(updated: PageComponent) {
        updatePage({
            components: page.components.map((c) =>
                c.id === updated.id ? updated : c
            ),
        });
    }

    function deleteComponent(id: string) {
        updatePage({ components: page.components.filter((c) => c.id !== id) });
        if (selectedId === id) setSelectedId(null);
    }

    function moveUp(idx: number) {
        if (idx === 0) return;
        const comps = [...page.components];
        const tmp = comps[idx - 1];
        comps[idx - 1] = comps[idx];
        comps[idx] = tmp;
        updatePage({ components: comps });
    }

    function moveDown(idx: number) {
        if (idx === page.components.length - 1) return;
        const comps = [...page.components];
        const tmp = comps[idx + 1];
        comps[idx + 1] = comps[idx];
        comps[idx] = tmp;
        updatePage({ components: comps });
    }

    function updateStyle(updates: Partial<PageStyle>) {
        updatePage({ style: { ...page.style, ...updates } });
    }

    function addIfAnnotation() {
        const ann: IfAnnotation = { id: makeId(), description: "" };
        updatePage({ ifAnnotations: [...page.ifAnnotations, ann] });
    }

    function updateIfAnnotation(id: string, description: string) {
        updatePage({
            ifAnnotations: page.ifAnnotations.map((a) =>
                a.id === id ? { ...a, description } : a
            ),
        });
    }

    function deleteIfAnnotation(id: string) {
        updatePage({
            ifAnnotations: page.ifAnnotations.filter((a) => a.id !== id),
        });
    }

    function addForAnnotation() {
        const ann: ForAnnotation = { id: makeId(), description: "" };
        updatePage({ forAnnotations: [...page.forAnnotations, ann] });
    }

    function updateForAnnotation(id: string, description: string) {
        updatePage({
            forAnnotations: page.forAnnotations.map((a) =>
                a.id === id ? { ...a, description } : a
            ),
        });
    }

    function deleteForAnnotation(id: string) {
        updatePage({
            forAnnotations: page.forAnnotations.filter((a) => a.id !== id),
        });
    }

    const inputStyle = {
        padding: "6px 10px",
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        fontSize: 13,
        outline: "none",
    };

    const labelStyle = {
        fontSize: 12,
        color: "#64748b",
        fontWeight: 600 as const,
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        marginBottom: 4,
        display: "block",
    };

    const componentTypes: ComponentType[] = [
        "Text",
        "Header",
        "TextBox",
        "TextArea",
        "CheckBox",
        "SelectBox",
        "Button",
    ];

    return (
        <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            {/* Left panel: component list */}
            <div
                style={{
                    width: 260,
                    borderRight: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    background: "#f8fafc",
                    overflow: "hidden",
                }}
            >
                {/* Page info */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e2e8f0",
                    }}
                >
                    <label style={labelStyle}>Page Name</label>
                    <input
                        value={page.name}
                        onChange={(e) => updatePage({ name: e.target.value })}
                        style={{ ...inputStyle, width: "100%" }}
                    />
                </div>

                {/* Annotations */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e2e8f0",
                    }}
                >
                    <label style={labelStyle}>State Annotation</label>
                    <input
                        value={page.stateAnnotation}
                        onChange={(e) =>
                            updatePage({ stateAnnotation: e.target.value })
                        }
                        placeholder="Describe state usage..."
                        style={{ ...inputStyle, width: "100%" }}
                    />

                    <div style={{ marginTop: 10 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <label style={labelStyle}>if Annotations</label>
                            <button
                                onClick={addIfAnnotation}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#3b82f6",
                                    cursor: "pointer",
                                    fontSize: 18,
                                    lineHeight: 1,
                                    padding: 0,
                                }}
                            >
                                +
                            </button>
                        </div>
                        {page.ifAnnotations.map((ann) => (
                            <div
                                key={ann.id}
                                style={{
                                    display: "flex",
                                    gap: 4,
                                    marginBottom: 4,
                                }}
                            >
                                <input
                                    value={ann.description}
                                    onChange={(e) =>
                                        updateIfAnnotation(
                                            ann.id,
                                            e.target.value
                                        )
                                    }
                                    placeholder="if condition..."
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button
                                    onClick={() =>
                                        deleteIfAnnotation(ann.id)
                                    }
                                    style={{
                                        background: "#fee2e2",
                                        color: "#ef4444",
                                        border: "none",
                                        borderRadius: 4,
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                        fontSize: 12,
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <label style={labelStyle}>for Annotations</label>
                            <button
                                onClick={addForAnnotation}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#3b82f6",
                                    cursor: "pointer",
                                    fontSize: 18,
                                    lineHeight: 1,
                                    padding: 0,
                                }}
                            >
                                +
                            </button>
                        </div>
                        {page.forAnnotations.map((ann) => (
                            <div
                                key={ann.id}
                                style={{
                                    display: "flex",
                                    gap: 4,
                                    marginBottom: 4,
                                }}
                            >
                                <input
                                    value={ann.description}
                                    onChange={(e) =>
                                        updateForAnnotation(
                                            ann.id,
                                            e.target.value
                                        )
                                    }
                                    placeholder="for loop..."
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button
                                    onClick={() =>
                                        deleteForAnnotation(ann.id)
                                    }
                                    style={{
                                        background: "#fee2e2",
                                        color: "#ef4444",
                                        border: "none",
                                        borderRadius: 4,
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                        fontSize: 12,
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add component */}
                <div
                    style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        gap: 6,
                    }}
                >
                    <select
                        value={addType}
                        onChange={(e) =>
                            setAddType(e.target.value as ComponentType)
                        }
                        style={{ ...inputStyle, flex: 1 }}
                    >
                        {componentTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={addComponent}
                        style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 5,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* Component list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {page.components.length === 0 ? (
                        <div
                            style={{
                                padding: "20px 16px",
                                color: "#94a3b8",
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            No components yet
                        </div>
                    ) : (
                        page.components.map((comp, idx) => (
                            <div
                                key={comp.id}
                                onClick={() => setSelectedId(comp.id)}
                                style={{
                                    padding: "8px 12px",
                                    marginBottom: 2,
                                    background:
                                        selectedId === comp.id
                                            ? "#dbeafe"
                                            : "transparent",
                                    borderLeft:
                                        selectedId === comp.id
                                            ? "3px solid #3b82f6"
                                            : "3px solid transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <span
                                    style={{
                                        flex: 1,
                                        fontSize: 13,
                                        color: "#1e293b",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {componentPreview(comp)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveUp(idx);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "0 2px",
                                        fontSize: 12,
                                        color: "#94a3b8",
                                    }}
                                    title="Move up"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveDown(idx);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "0 2px",
                                        fontSize: 12,
                                        color: "#94a3b8",
                                    }}
                                    title="Move down"
                                >
                                    ▼
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteComponent(comp.id);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#ef4444",
                                        fontSize: 14,
                                        padding: "0 2px",
                                    }}
                                    title="Delete"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Page style */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderTop: "1px solid #e2e8f0",
                        background: "#f1f5f9",
                    }}
                >
                    <label style={labelStyle}>Page Style</label>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 6,
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                BG Color
                            </div>
                            <input
                                type="color"
                                value={
                                    page.style.backgroundColor ?? "#ffffff"
                                }
                                onChange={(e) =>
                                    updateStyle({
                                        backgroundColor: e.target.value,
                                    })
                                }
                                style={{
                                    width: "100%",
                                    height: 28,
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: 4,
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                Text Color
                            </div>
                            <input
                                type="color"
                                value={page.style.color ?? "#000000"}
                                onChange={(e) =>
                                    updateStyle({ color: e.target.value })
                                }
                                style={{
                                    width: "100%",
                                    height: 28,
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: 4,
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            Padding
                        </div>
                        <input
                            value={page.style.padding ?? ""}
                            onChange={(e) =>
                                updateStyle({ padding: e.target.value })
                            }
                            placeholder="e.g. 20px"
                            style={{ ...inputStyle, width: "100%" }}
                        />
                    </div>
                </div>
            </div>

            {/* Right panel: component editor */}
            <div
                style={{
                    flex: 1,
                    padding: 20,
                    overflowY: "auto",
                    background: "white",
                }}
            >
                {selectedComp !== null ? (
                    <>
                        <h3
                            style={{
                                margin: "0 0 16px",
                                color: "#1e293b",
                                fontSize: 16,
                            }}
                        >
                            Edit Component: {selectedComp.type}
                        </h3>
                        <ComponentEditor
                            component={selectedComp}
                            onChange={updateComponent}
                        />
                    </>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            color: "#94a3b8",
                            fontSize: 14,
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <div style={{ fontSize: 36 }}>🖱️</div>
                        <div>Select a component to edit it</div>
                    </div>
                )}
            </div>
        </div>
    );
}
