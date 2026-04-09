import { useState } from "react";
import type { Project } from "../types";
import { generatePythonCode } from "../codeGen";
import { exportToDocx } from "../docxExport";

interface CodeExportProps {
    project: Project;
}

export function CodeExport({ project }: CodeExportProps) {
    const [copied, setCopied] = useState(false);
    const [exporting, setExporting] = useState(false);

    const code = generatePythonCode(project);

    function handleCopy() {
        void navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleDocxExport() {
        setExporting(true);
        void exportToDocx(project).finally(() => setExporting(false));
    }

    return (
        <div
            style={{
                padding: 24,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <h2 style={{ margin: 0, color: "#1e293b" }}>
                        Generated Python Code
                    </h2>
                    <p
                        style={{
                            margin: "4px 0 0",
                            color: "#64748b",
                            fontSize: 14,
                        }}
                    >
                        Copy this starter code for your Drafter application.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: copied ? "#22c55e" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            transition: "background 0.2s",
                        }}
                    >
                        {copied ? "✓ Copied!" : "📋 Copy Code"}
                    </button>
                    <button
                        onClick={handleDocxExport}
                        disabled={exporting}
                        style={{
                            background: exporting ? "#94a3b8" : "#8b5cf6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 16px",
                            cursor: exporting ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        {exporting ? "Exporting…" : "📄 Export DOCX"}
                    </button>
                </div>
            </div>

            <pre
                style={{
                    flex: 1,
                    background: "#0f172a",
                    color: "#e2e8f0",
                    borderRadius: 10,
                    padding: "20px 24px",
                    overflow: "auto",
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily:
                        "'Fira Code', 'Cascadia Code', monospace",
                    margin: 0,
                    border: "1px solid #1e293b",
                }}
            >
                {code}
            </pre>
        </div>
    );
}
