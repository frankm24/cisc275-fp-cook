import { StateModel, StateAttribute, SecondaryDataclass } from "../types";
import { makeId } from "../types";

interface StateEditorProps {
    stateModel: StateModel;
    onChange: (updated: StateModel) => void;
}

const COMMON_TYPES = ["str", "int", "float", "bool", "list"];

function AttributeRow({
    attr,
    onUpdate,
    onDelete,
    secondaryNames,
}: {
    attr: StateAttribute;
    onUpdate: (updated: StateAttribute) => void;
    onDelete: () => void;
    secondaryNames: string[];
}) {
    const inputStyle = {
        padding: "5px 8px",
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        fontSize: 13,
        outline: "none",
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: 8,
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
            }}
        >
            <input
                value={attr.name}
                onChange={(e) => onUpdate({ ...attr, name: e.target.value })}
                placeholder="name"
                style={inputStyle}
            />
            <select
                value={attr.type}
                onChange={(e) => onUpdate({ ...attr, type: e.target.value })}
                style={inputStyle}
            >
                {COMMON_TYPES.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
                {secondaryNames.map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
                <option value={attr.type}>{attr.type}</option>
            </select>
            <input
                value={attr.description}
                onChange={(e) =>
                    onUpdate({ ...attr, description: e.target.value })
                }
                placeholder="description"
                style={inputStyle}
            />
            <button
                onClick={onDelete}
                style={{
                    background: "#fee2e2",
                    color: "#ef4444",
                    border: "none",
                    borderRadius: 5,
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: 13,
                }}
            >
                ×
            </button>
        </div>
    );
}

function DataclassEditor({
    dataclass,
    onUpdate,
    onDelete,
    secondaryNames,
}: {
    dataclass: SecondaryDataclass;
    onUpdate: (updated: SecondaryDataclass) => void;
    onDelete: () => void;
    secondaryNames: string[];
}) {
    function addAttr() {
        const attr: StateAttribute = {
            id: makeId(),
            name: "field",
            type: "str",
            description: "",
        };
        onUpdate({ ...dataclass, attributes: [...dataclass.attributes, attr] });
    }

    function updateAttr(updated: StateAttribute) {
        onUpdate({
            ...dataclass,
            attributes: dataclass.attributes.map((a) =>
                a.id === updated.id ? updated : a
            ),
        });
    }

    function deleteAttr(id: string) {
        onUpdate({
            ...dataclass,
            attributes: dataclass.attributes.filter((a) => a.id !== id),
        });
    }

    const inputStyle = {
        padding: "5px 8px",
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        fontSize: 13,
        outline: "none",
    };

    return (
        <div
            style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                background: "#f8fafc",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <input
                    value={dataclass.name}
                    onChange={(e) =>
                        onUpdate({ ...dataclass, name: e.target.value })
                    }
                    style={{
                        ...inputStyle,
                        fontWeight: 700,
                        fontSize: 15,
                        flex: 1,
                    }}
                    placeholder="ClassName"
                />
                <button
                    onClick={onDelete}
                    style={{
                        background: "#fee2e2",
                        color: "#ef4444",
                        border: "none",
                        borderRadius: 5,
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontSize: 13,
                    }}
                >
                    Delete Class
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 8,
                    marginBottom: 4,
                }}
            >
                {["Name", "Type", "Description", ""].map((h) => (
                    <div
                        key={h}
                        style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                        }}
                    >
                        {h}
                    </div>
                ))}
            </div>

            {dataclass.attributes.map((attr) => (
                <AttributeRow
                    key={attr.id}
                    attr={attr}
                    onUpdate={updateAttr}
                    onDelete={() => deleteAttr(attr.id)}
                    secondaryNames={secondaryNames}
                />
            ))}

            <button
                onClick={addAttr}
                style={{
                    marginTop: 10,
                    background: "#e2e8f0",
                    color: "#475569",
                    border: "none",
                    borderRadius: 5,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: 13,
                }}
            >
                + Add Field
            </button>
        </div>
    );
}

export function StateEditor({ stateModel, onChange }: StateEditorProps) {
    const secondaryNames = stateModel.secondaryDataclasses.map(
        (dc) => dc.name
    );

    function addPrimaryAttr() {
        const attr: StateAttribute = {
            id: makeId(),
            name: "attribute",
            type: "str",
            description: "",
        };
        onChange({
            ...stateModel,
            primaryAttributes: [...stateModel.primaryAttributes, attr],
        });
    }

    function updatePrimaryAttr(updated: StateAttribute) {
        onChange({
            ...stateModel,
            primaryAttributes: stateModel.primaryAttributes.map((a) =>
                a.id === updated.id ? updated : a
            ),
        });
    }

    function deletePrimaryAttr(id: string) {
        onChange({
            ...stateModel,
            primaryAttributes: stateModel.primaryAttributes.filter(
                (a) => a.id !== id
            ),
        });
    }

    function addSecondaryDataclass() {
        const dc: SecondaryDataclass = {
            id: makeId(),
            name: "NewClass",
            attributes: [],
        };
        onChange({
            ...stateModel,
            secondaryDataclasses: [
                ...stateModel.secondaryDataclasses,
                dc,
            ],
        });
    }

    function updateSecondaryDataclass(updated: SecondaryDataclass) {
        onChange({
            ...stateModel,
            secondaryDataclasses: stateModel.secondaryDataclasses.map(
                (dc) => (dc.id === updated.id ? updated : dc)
            ),
        });
    }

    function deleteSecondaryDataclass(id: string) {
        onChange({
            ...stateModel,
            secondaryDataclasses: stateModel.secondaryDataclasses.filter(
                (dc) => dc.id !== id
            ),
        });
    }

    const count = stateModel.primaryAttributes.length;
    const countColor = count >= 4 ? "#22c55e" : "#f59e0b";

    const sectionStyle = {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    };

    const headingStyle = {
        margin: "0 0 4px",
        color: "#1e293b",
        fontSize: 16,
        fontWeight: 700 as const,
    };

    const subStyle = {
        fontSize: 13,
        color: "#64748b",
        marginBottom: 12,
    };

    const columnHeaders = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        gap: 8,
        marginBottom: 4,
    };
    const colHeaderStyle = {
        fontSize: 11,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
        fontWeight: 600 as const,
        letterSpacing: "0.05em",
    };

    return (
        <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
            {/* Primary State */}
            <div style={sectionStyle}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <div>
                        <h2 style={headingStyle}>
                            Primary State (State dataclass)
                        </h2>
                        <div style={subStyle}>
                            The main State class for your Drafter app.
                            Minimum 4 attributes required.
                        </div>
                    </div>
                    <span
                        style={{
                            background:
                                count >= 4 ? "#dcfce7" : "#fef3c7",
                            color: countColor,
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        {count} / 4+ attrs
                    </span>
                </div>

                <div style={columnHeaders}>
                    <div style={colHeaderStyle}>Name</div>
                    <div style={colHeaderStyle}>Type</div>
                    <div style={colHeaderStyle}>Description</div>
                    <div />
                </div>

                {stateModel.primaryAttributes.map((attr) => (
                    <AttributeRow
                        key={attr.id}
                        attr={attr}
                        onUpdate={updatePrimaryAttr}
                        onDelete={() => deletePrimaryAttr(attr.id)}
                        secondaryNames={secondaryNames}
                    />
                ))}

                <button
                    onClick={addPrimaryAttr}
                    style={{
                        marginTop: 12,
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                    + Add Attribute
                </button>
            </div>

            {/* Secondary Dataclasses */}
            <div style={sectionStyle}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                    }}
                >
                    <div>
                        <h2 style={headingStyle}>Secondary Dataclasses</h2>
                        <div style={subStyle}>
                            Additional data structures used in your state
                            (e.g., Task, Post, Item).
                        </div>
                    </div>
                    <button
                        onClick={addSecondaryDataclass}
                        style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        + Add Dataclass
                    </button>
                </div>

                {stateModel.secondaryDataclasses.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 24,
                            color: "#94a3b8",
                            fontSize: 13,
                        }}
                    >
                        No secondary dataclasses yet. Add one above.
                    </div>
                ) : (
                    stateModel.secondaryDataclasses.map((dc) => (
                        <DataclassEditor
                            key={dc.id}
                            dataclass={dc}
                            onUpdate={updateSecondaryDataclass}
                            onDelete={() => deleteSecondaryDataclass(dc.id)}
                            secondaryNames={secondaryNames}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
