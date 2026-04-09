import { demoProject1, demoProject2 } from "../src/demoProjects";

test("demoProject1 has a name", () => {
    expect(demoProject1.name.length).toBeGreaterThan(0);
});

test("demoProject1 has at least 2 pages", () => {
    expect(demoProject1.pages.length).toBeGreaterThanOrEqual(2);
});

test("demoProject1 has routes", () => {
    expect(demoProject1.routes.length).toBeGreaterThan(0);
});

test("demoProject1 state has at least 4 primary attributes", () => {
    expect(demoProject1.stateModel.primaryAttributes.length).toBeGreaterThanOrEqual(4);
});

test("demoProject1 has at least one secondary dataclass", () => {
    expect(demoProject1.stateModel.secondaryDataclasses.length).toBeGreaterThanOrEqual(1);
});

test("demoProject2 has a name", () => {
    expect(demoProject2.name.length).toBeGreaterThan(0);
});

test("demoProject2 has at least 2 pages", () => {
    expect(demoProject2.pages.length).toBeGreaterThanOrEqual(2);
});

test("demoProject2 has routes", () => {
    expect(demoProject2.routes.length).toBeGreaterThan(0);
});

test("demoProject2 state has at least 4 primary attributes", () => {
    expect(demoProject2.stateModel.primaryAttributes.length).toBeGreaterThanOrEqual(4);
});

test("demoProject2 has at least one secondary dataclass", () => {
    expect(demoProject2.stateModel.secondaryDataclasses.length).toBeGreaterThanOrEqual(1);
});

test("demo projects have different ids", () => {
    expect(demoProject1.id).not.toBe(demoProject2.id);
});

test("demoProject1 pages all have valid positions", () => {
    demoProject1.pages.forEach(page => {
        expect(typeof page.position.x).toBe("number");
        expect(typeof page.position.y).toBe("number");
    });
});

test("demoProject1 routes reference valid page ids", () => {
    const pageIds = new Set(demoProject1.pages.map(p => p.id));
    demoProject1.routes.forEach(route => {
        expect(pageIds.has(route.sourcePageId)).toBe(true);
        expect(pageIds.has(route.targetPageId)).toBe(true);
    });
});
