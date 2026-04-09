import { makeId } from "../src/types";

test("makeId returns a non-empty string", () => {
    const id = makeId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
});

test("makeId returns unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => makeId()));
    expect(ids.size).toBe(100);
});

test("makeId returns UUID format", () => {
    const id = makeId();
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
