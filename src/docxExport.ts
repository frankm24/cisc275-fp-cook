import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { Project } from "./types";

export async function exportToDocx(project: Project): Promise<void> {
    const paragraphs: Paragraph[] = [];

    paragraphs.push(
        new Paragraph({
            text: project.name,
            heading: HeadingLevel.TITLE,
        })
    );

    paragraphs.push(
        new Paragraph({
            text: "Purpose",
            heading: HeadingLevel.HEADING_1,
        })
    );
    paragraphs.push(new Paragraph({ text: project.purpose }));

    paragraphs.push(
        new Paragraph({
            text: "State Model",
            heading: HeadingLevel.HEADING_1,
        })
    );
    paragraphs.push(
        new Paragraph({
            text: "Primary State Attributes",
            heading: HeadingLevel.HEADING_2,
        })
    );
    project.stateModel.primaryAttributes.forEach((attr) => {
        const typeStr =
            attr.isListOf === true ? `list[${attr.type}]` : attr.type;
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${attr.name}: `, bold: true }),
                    new TextRun({ text: `${typeStr} - ${attr.description}` }),
                ],
            })
        );
    });

    if (project.stateModel.secondaryDataclasses.length > 0) {
        paragraphs.push(
            new Paragraph({
                text: "Secondary Dataclasses",
                heading: HeadingLevel.HEADING_2,
            })
        );
        project.stateModel.secondaryDataclasses.forEach((dc) => {
            paragraphs.push(
                new Paragraph({
                    text: dc.name,
                    heading: HeadingLevel.HEADING_3,
                })
            );
            dc.attributes.forEach((attr) => {
                const typeStr =
                    attr.isListOf === true ? `list[${attr.type}]` : attr.type;
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${attr.name}: `, bold: true }),
                            new TextRun({
                                text: `${typeStr} - ${attr.description}`,
                            }),
                        ],
                    })
                );
            });
        });
    }

    paragraphs.push(
        new Paragraph({
            text: "Pages",
            heading: HeadingLevel.HEADING_1,
        })
    );
    project.pages.forEach((page) => {
        paragraphs.push(
            new Paragraph({
                text: page.name,
                heading: HeadingLevel.HEADING_2,
            })
        );
        if (page.stateAnnotation.length > 0) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: "State: ", bold: true }),
                        new TextRun({ text: page.stateAnnotation }),
                    ],
                })
            );
        }
        page.ifAnnotations.forEach((ann) => {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: "if: ", bold: true }),
                        new TextRun({ text: ann.description }),
                    ],
                })
            );
        });
        page.forAnnotations.forEach((ann) => {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: "for: ", bold: true }),
                        new TextRun({ text: ann.description }),
                    ],
                })
            );
        });
        if (page.components.length > 0) {
            paragraphs.push(
                new Paragraph({
                    text: "Components:",
                    heading: HeadingLevel.HEADING_3,
                })
            );
            page.components.forEach((comp) => {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `[${comp.type}] `,
                                bold: true,
                            }),
                            new TextRun({
                                text: JSON.stringify(comp.config),
                            }),
                        ],
                    })
                );
            });
        }
    });

    paragraphs.push(
        new Paragraph({
            text: "Routes",
            heading: HeadingLevel.HEADING_1,
        })
    );
    project.routes.forEach((route) => {
        const srcPage = project.pages.find((p) => p.id === route.sourcePageId);
        const tgtPage = project.pages.find((p) => p.id === route.targetPageId);
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: route.name, bold: true }),
                    new TextRun({
                        text: `: ${srcPage?.name ?? route.sourcePageId} → ${tgtPage?.name ?? route.targetPageId}`,
                    }),
                ],
            })
        );
        if (route.stateAnnotation.length > 0) {
            paragraphs.push(
                new Paragraph({
                    text: `  State: ${route.stateAnnotation}`,
                })
            );
        }
    });

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: paragraphs,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}.docx`;
    a.click();
    URL.revokeObjectURL(url);
}
