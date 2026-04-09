import type {
    Project,
    DrafterPage,
    StateModel,
    SecondaryDataclass,
    StateAttribute,
    PageComponent,
    ComponentConfig,
    TextConfig,
    TextBoxConfig,
    TextAreaConfig,
    CheckBoxConfig,
    SelectBoxConfig,
    ButtonConfig,
    HeaderConfig,
    Route,
} from "./types";

function isTextConfig(c: ComponentConfig): c is TextConfig {
    return "content" in c && !("level" in c);
}
function isTextBoxConfig(c: ComponentConfig): c is TextBoxConfig {
    return (
        "name" in c &&
        "defaultValue" in c &&
        typeof (c as TextBoxConfig).defaultValue === "string" &&
        !("options" in c)
    );
}
function isTextAreaConfig(c: ComponentConfig): c is TextAreaConfig {
    return (
        "name" in c &&
        "defaultValue" in c &&
        typeof (c as TextAreaConfig).defaultValue === "string" &&
        !("options" in c)
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

function componentToPython(comp: PageComponent): string {
    const { type, config } = comp;
    if (type === "Text" && isTextConfig(config)) {
        return `        "${config.content}",`;
    }
    if (type === "Header" && isHeaderConfig(config)) {
        return `        Header("${config.content}", level=${config.level}),`;
    }
    if (type === "TextBox" && isTextBoxConfig(config)) {
        return `        TextBox("${config.name}", default_value="${config.defaultValue}"),`;
    }
    if (type === "TextArea" && isTextAreaConfig(config)) {
        return `        TextArea("${config.name}", default_value="${config.defaultValue}"),`;
    }
    if (type === "CheckBox" && isCheckBoxConfig(config)) {
        return `        CheckBox("${config.name}", default_value=${config.defaultValue ? "True" : "False"}),`;
    }
    if (type === "SelectBox" && isSelectBoxConfig(config)) {
        const opts = config.options.map((o) => `"${o}"`).join(", ");
        return `        SelectBox("${config.name}", options=[${opts}]),`;
    }
    if (type === "Button" && isButtonConfig(config)) {
        return `        Button("${config.label}", url="${config.route}"),`;
    }
    return `        # Unknown component`;
}

function attributeToCode(attr: StateAttribute): string {
    const typeStr = attr.isListOf === true ? `list[${attr.type}]` : attr.type;
    return `    ${attr.name}: ${typeStr}`;
}

function secondaryDataclassToCode(dc: SecondaryDataclass): string {
    const lines = [`@dataclass`, `class ${dc.name}:`];
    if (dc.attributes.length === 0) {
        lines.push(`    pass`);
    } else {
        dc.attributes.forEach((a) => lines.push(attributeToCode(a)));
    }
    return lines.join("\n");
}

function stateModelToCode(model: StateModel): string {
    const lines = [`@dataclass`, `class State:`];
    if (model.primaryAttributes.length === 0) {
        lines.push(`    pass`);
    } else {
        model.primaryAttributes.forEach((a) => lines.push(attributeToCode(a)));
    }
    return lines.join("\n");
}

function pageToCode(page: DrafterPage, routes: Route[]): string {
    const funcName = page.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const outRoutes = routes.filter((r) => r.sourcePageId === page.id);

    const lines: string[] = [];

    if (page.stateAnnotation.length > 0) {
        lines.push(`# State: ${page.stateAnnotation}`);
    }
    page.ifAnnotations.forEach((ann) => {
        lines.push(`# if: ${ann.description}`);
    });
    page.forAnnotations.forEach((ann) => {
        lines.push(`# for: ${ann.description}`);
    });

    if (outRoutes.length > 0) {
        const routeNames = outRoutes.map((r) => r.name).join(", ");
        lines.push(`@route`);
        lines.push(
            `def ${funcName}(state: State) -> Page:  # routes: ${routeNames}`
        );
    } else {
        lines.push(`@route`);
        lines.push(`def ${funcName}(state: State) -> Page:`);
    }
    lines.push(`    return Page(state, [`);

    if (page.components.length === 0) {
        lines.push(`        # No components`);
    } else {
        page.components.forEach((comp) => {
            lines.push(componentToPython(comp));
        });
    }

    lines.push(`    ])`);
    return lines.join("\n");
}

function getDefaultForType(type: string): string {
    switch (type) {
        case "str":
            return `""`;
        case "int":
            return `0`;
        case "float":
            return `0.0`;
        case "bool":
            return `False`;
        default:
            if (type.startsWith("list[")) return `[]`;
            return `None`;
    }
}

export function generatePythonCode(project: Project): string {
    const lines: string[] = [];
    lines.push(`from drafter import *`);
    lines.push(`from dataclasses import dataclass`);
    lines.push(``);

    project.stateModel.secondaryDataclasses.forEach((dc) => {
        lines.push(secondaryDataclassToCode(dc));
        lines.push(``);
    });

    lines.push(stateModelToCode(project.stateModel));
    lines.push(``);

    project.pages.forEach((page) => {
        lines.push(pageToCode(page, project.routes));
        lines.push(``);
    });

    const defaults = project.stateModel.primaryAttributes
        .map((a) =>
            `${a.name}=${getDefaultForType(a.isListOf === true ? `list[${a.type}]` : a.type)}`
        )
        .join(", ");
    lines.push(`start_server(State(${defaults}))`);

    return lines.join("\n");
}
