import type {
    PageComponent,
    ComponentType,
    ComponentConfig,
    TextConfig,
    TextBoxConfig,
    TextAreaConfig,
    CheckBoxConfig,
    SelectBoxConfig,
    ButtonConfig,
    HeaderConfig,
} from "../types";

interface ComponentEditorProps {
    component: PageComponent;
    onChange: (updated: PageComponent) => void;
}

function isTextConfig(c: ComponentConfig): c is TextConfig {
    return "content" in c && !("level" in c);
}
function isTextBoxConfig(c: ComponentConfig): c is TextBoxConfig {
    return (
        "name" in c &&
        "defaultValue" in c &&
        typeof (c as TextBoxConfig).defaultValue === "string" &&
        !("options" in c) &&
        !("level" in c)
    );
}
function isTextAreaConfig(c: ComponentConfig): c is TextAreaConfig {
    return (
        "name" in c &&
        "defaultValue" in c &&
        typeof (c as TextAreaConfig).defaultValue === "string" &&
        !("options" in c) &&
        !("level" in c)
    );
}
function isCheckBoxConfig(c: ComponentConfig): c is CheckBoxConfig {
    return (
        "name" in c &&
        "defaultValue" in c &&
        typeof (c as CheckBoxConfig).defaultValue === "boolean"
    );
}
function isSelectBoxConfig(c: ComponentConfig): c is SelectBoxConfig {
    return "options" in c;
}
function isButtonConfig(c: ComponentConfig): c is ButtonConfig {
    return "label" in c && "route" in c;
}
function isHeaderConfig(c: ComponentConfig): c is HeaderConfig {
    return "level" in c;
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

export function ComponentEditor({
    component,
    onChange,
}: ComponentEditorProps) {
    function updateConfig(updates: Partial<ComponentConfig>) {
        onChange({
            ...component,
            config: { ...component.config, ...updates } as ComponentConfig,
        });
    }

    function handleTypeChange(newType: ComponentType) {
        onChange({
            ...component,
            type: newType,
            config: defaultConfig(newType),
        });
    }

    const { type, config } = component;

    const inputStyle = {
        padding: "6px 10px",
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        fontSize: 13,
        width: "100%",
        boxSizing: "border-box" as const,
        outline: "none",
    };

    const labelStyle = {
        fontSize: 12,
        color: "#64748b",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
                <div style={labelStyle}>Component Type</div>
                <select
                    value={type}
                    onChange={(e) =>
                        handleTypeChange(e.target.value as ComponentType)
                    }
                    style={{ ...inputStyle, marginTop: 4 }}
                >
                    {(
                        [
                            "Text",
                            "Header",
                            "TextBox",
                            "TextArea",
                            "CheckBox",
                            "SelectBox",
                            "Button",
                        ] as ComponentType[]
                    ).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            {type === "Text" && isTextConfig(config) && (
                <div>
                    <div style={labelStyle}>Content</div>
                    <textarea
                        value={config.content}
                        onChange={(e) =>
                            updateConfig({ content: e.target.value })
                        }
                        rows={3}
                        style={{
                            ...inputStyle,
                            marginTop: 4,
                            resize: "vertical",
                            fontFamily: "inherit",
                        }}
                    />
                </div>
            )}

            {type === "Header" && isHeaderConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Content</div>
                        <input
                            value={config.content}
                            onChange={(e) =>
                                updateConfig({ content: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Level</div>
                        <select
                            value={config.level}
                            onChange={(e) =>
                                updateConfig({
                                    level: parseInt(
                                        e.target.value
                                    ) as 1 | 2 | 3 | 4 | 5 | 6,
                                })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        >
                            {[1, 2, 3, 4, 5, 6].map((l) => (
                                <option key={l} value={l}>
                                    H{l}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {type === "TextBox" && isTextBoxConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Field Name</div>
                        <input
                            value={config.name}
                            onChange={(e) =>
                                updateConfig({ name: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Default Value</div>
                        <input
                            value={config.defaultValue}
                            onChange={(e) =>
                                updateConfig({
                                    defaultValue: e.target.value,
                                })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                </>
            )}

            {type === "TextArea" && isTextAreaConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Field Name</div>
                        <input
                            value={config.name}
                            onChange={(e) =>
                                updateConfig({ name: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Default Value</div>
                        <textarea
                            value={config.defaultValue}
                            onChange={(e) =>
                                updateConfig({
                                    defaultValue: e.target.value,
                                })
                            }
                            rows={2}
                            style={{
                                ...inputStyle,
                                marginTop: 4,
                                resize: "vertical",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>
                </>
            )}

            {type === "CheckBox" && isCheckBoxConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Field Name</div>
                        <input
                            value={config.name}
                            onChange={(e) =>
                                updateConfig({ name: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 4,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={config.defaultValue}
                            onChange={(e) =>
                                updateConfig({
                                    defaultValue: e.target.checked,
                                })
                            }
                        />
                        <span style={{ fontSize: 13, color: "#475569" }}>
                            Default checked
                        </span>
                    </div>
                </>
            )}

            {type === "SelectBox" && isSelectBoxConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Field Name</div>
                        <input
                            value={config.name}
                            onChange={(e) =>
                                updateConfig({ name: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Options (one per line)</div>
                        <textarea
                            value={config.options.join("\n")}
                            onChange={(e) =>
                                updateConfig({
                                    options: e.target.value
                                        .split("\n")
                                        .filter(
                                            (o) => o.trim().length > 0
                                        ),
                                    defaultValue:
                                        e.target.value.split("\n")[0] ?? "",
                                })
                            }
                            rows={4}
                            style={{
                                ...inputStyle,
                                marginTop: 4,
                                resize: "vertical",
                                fontFamily: "monospace",
                            }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Default Value</div>
                        <select
                            value={config.defaultValue}
                            onChange={(e) =>
                                updateConfig({
                                    defaultValue: e.target.value,
                                })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        >
                            {config.options.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {type === "Button" && isButtonConfig(config) && (
                <>
                    <div>
                        <div style={labelStyle}>Label</div>
                        <input
                            value={config.label}
                            onChange={(e) =>
                                updateConfig({ label: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Route / URL</div>
                        <input
                            value={config.route}
                            onChange={(e) =>
                                updateConfig({ route: e.target.value })
                            }
                            style={{ ...inputStyle, marginTop: 4 }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
