import { saveProject, loadProjects, deleteProject } from "../src/storage";
import type { Project } from "../src/types";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

function makeProject(id: string, name: string): Project {
    return {
        id,
        name,
        purpose: "",
        pages: [],
        routes: [],
        stateModel: { primaryAttributes: [], secondaryDataclasses: [] },
        lastModified: Date.now(),
    };
}

beforeEach(() => {
    localStorage.clear();
});

test("loadProjects returns empty array when nothing saved", () => {
    expect(loadProjects()).toEqual([]);
});

test("saveProject stores a project", () => {
    const project = makeProject("id1", "My Project");
    saveProject(project);
    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe("id1");
    expect(projects[0].name).toBe("My Project");
});

test("saveProject updates existing project by id", () => {
    const project = makeProject("id1", "Original");
    saveProject(project);
    const updated = { ...project, name: "Updated" };
    saveProject(updated);
    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe("Updated");
});

test("saveProject can store multiple projects", () => {
    saveProject(makeProject("id1", "Project 1"));
    saveProject(makeProject("id2", "Project 2"));
    saveProject(makeProject("id3", "Project 3"));
    expect(loadProjects()).toHaveLength(3);
});

test("deleteProject removes the project with given id", () => {
    saveProject(makeProject("id1", "Project 1"));
    saveProject(makeProject("id2", "Project 2"));
    deleteProject("id1");
    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe("id2");
});

test("deleteProject with non-existent id does not affect others", () => {
    saveProject(makeProject("id1", "Project 1"));
    deleteProject("nonexistent");
    expect(loadProjects()).toHaveLength(1);
});

test("loadProjects restores full project structure", () => {
    const project: Project = {
        id: "full-id",
        name: "Full Project",
        purpose: "Testing persistence",
        pages: [
            {
                id: "p1",
                name: "index",
                components: [],
                style: {},
                stateAnnotation: "some annotation",
                ifAnnotations: [{ id: "if1", description: "check condition" }],
                forAnnotations: [],
                position: { x: 100, y: 200 },
            },
        ],
        routes: [
            {
                id: "r1",
                name: "go_home",
                sourcePageId: "p1",
                targetPageId: "p2",
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
            },
        ],
        stateModel: {
            primaryAttributes: [
                { id: "a1", name: "msg", type: "str", description: "message" },
            ],
            secondaryDataclasses: [
                { id: "dc1", name: "Item", attributes: [] },
            ],
        },
        lastModified: 12345,
    };
    saveProject(project);
    const loaded = loadProjects();
    expect(loaded[0]).toEqual(project);
});
