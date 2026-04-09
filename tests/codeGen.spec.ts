import { generatePythonCode } from "../src/codeGen";
import type { Project } from "../src/types";

function makeProject(overrides: Partial<Project> = {}): Project {
    return {
        id: "test-id",
        name: "Test Project",
        purpose: "Testing",
        pages: [],
        routes: [],
        stateModel: { primaryAttributes: [], secondaryDataclasses: [] },
        lastModified: 0,
        ...overrides,
    };
}

test("generatePythonCode includes required imports", () => {
    const code = generatePythonCode(makeProject());
    expect(code).toContain("from drafter import *");
    expect(code).toContain("from dataclasses import dataclass");
});

test("generatePythonCode includes start_server call", () => {
    const code = generatePythonCode(makeProject());
    expect(code).toContain("start_server(State(");
});

test("generatePythonCode generates empty State dataclass", () => {
    const code = generatePythonCode(makeProject());
    expect(code).toContain("@dataclass");
    expect(code).toContain("class State:");
    expect(code).toContain("    pass");
});

test("generatePythonCode generates State with attributes", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "message", type: "str", description: "A message" },
                { id: "a2", name: "count", type: "int", description: "A count" },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("    message: str");
    expect(code).toContain("    count: int");
});

test("generatePythonCode generates list attribute with isListOf", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "items", type: "Item", description: "List of items", isListOf: true },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("    items: list[Item]");
});

test("generatePythonCode generates secondary dataclass", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [],
            secondaryDataclasses: [
                {
                    id: "dc1",
                    name: "Item",
                    attributes: [
                        { id: "a1", name: "title", type: "str", description: "Title" },
                        { id: "a2", name: "done", type: "bool", description: "Done?" },
                    ],
                },
            ],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("class Item:");
    expect(code).toContain("    title: str");
    expect(code).toContain("    done: bool");
});

test("generatePythonCode generates empty secondary dataclass with pass", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [],
            secondaryDataclasses: [
                { id: "dc1", name: "Empty", attributes: [] },
            ],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("class Empty:");
    expect(code).toContain("    pass");
});

test("generatePythonCode generates route function for page", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("@route");
    expect(code).toContain("def index(state: State) -> Page:");
});

test("generatePythonCode includes route names comment when page has outgoing routes", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
        routes: [
            {
                id: "r1",
                name: "go_to_result",
                sourcePageId: "p1",
                targetPageId: "p2",
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("routes: go_to_result");
});

test("generatePythonCode generates Text component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "Text",
                        config: { content: "Hello World" },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('"Hello World"');
});

test("generatePythonCode generates Button component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "Button",
                        config: { label: "Submit", route: "submit" },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('Button("Submit", url="submit")');
});

test("generatePythonCode generates Header component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "Header",
                        config: { content: "My Title", level: 1 },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('Header("My Title", level=1)');
});

test("generatePythonCode generates TextBox component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "TextBox",
                        config: { name: "username", defaultValue: "guest" },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('TextBox("username", default_value="guest")');
});

test("generatePythonCode generates CheckBox component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "CheckBox",
                        config: { name: "agreed", defaultValue: true },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('CheckBox("agreed", default_value=True)');
});

test("generatePythonCode generates SelectBox component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "SelectBox",
                        config: { name: "color", options: ["red", "blue"], defaultValue: "red" },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('SelectBox("color", options=["red", "blue"])');
});

test("generatePythonCode generates TextArea component", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [
                    {
                        id: "c1",
                        type: "TextArea",
                        config: { name: "bio", defaultValue: "Enter bio" },
                        style: {},
                    },
                ],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain('TextArea("bio", default_value="Enter bio")');
});

test("generatePythonCode includes state annotation comment", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "reads message from state",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("# State: reads message from state");
});

test("generatePythonCode includes if annotation comment", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [{ id: "if1", description: "check if logged in" }],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("# if: check if logged in");
});

test("generatePythonCode includes for annotation comment", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [{ id: "for1", description: "loop through items" }],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("# for: loop through items");
});

test("generatePythonCode generates correct defaults for str type", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "msg", type: "str", description: "" },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain('start_server(State(msg="")');
});

test("generatePythonCode generates correct defaults for int type", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "count", type: "int", description: "" },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("start_server(State(count=0)");
});

test("generatePythonCode generates correct defaults for bool type", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "active", type: "bool", description: "" },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("start_server(State(active=False)");
});

test("generatePythonCode generates correct defaults for list type", () => {
    const project = makeProject({
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "items", type: "Item", description: "", isListOf: true },
            ],
            secondaryDataclasses: [],
        },
    });
    const code = generatePythonCode(project);
    expect(code).toContain("start_server(State(items=[])");
});

test("generatePythonCode sanitizes page names with special chars", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "My Page!",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("def my_page_(state: State) -> Page:");
});

test("generatePythonCode empty page has no components comment", () => {
    const project = makeProject({
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
                position: { x: 0, y: 0 },
            },
        ],
    });
    const code = generatePythonCode(project);
    expect(code).toContain("# No components");
});
