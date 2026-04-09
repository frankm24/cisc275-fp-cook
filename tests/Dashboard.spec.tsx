import { render, screen, fireEvent } from "@testing-library/react";
import { Dashboard } from "../src/components/Dashboard";

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

// Mock window.confirm
global.confirm = () => true;

beforeEach(() => {
    localStorage.clear();
});

test("Dashboard shows Drafter Drafter heading", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    expect(screen.getByText("Drafter Drafter")).toBeInTheDocument();
});

test("Dashboard shows My Projects heading", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    expect(screen.getByText("My Projects")).toBeInTheDocument();
});

test("Dashboard shows empty state message when no projects", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    expect(screen.getByText(/No projects yet/i)).toBeInTheDocument();
});

test("Dashboard has New Project button", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    expect(screen.getByText("+ New Project")).toBeInTheDocument();
});

test("Dashboard has demo project load buttons", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    expect(screen.getByText(/Load Demo: Todo App/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Demo: Blog Platform/i)).toBeInTheDocument();
});

test("Dashboard clicking New Project shows create form", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText("+ New Project"));
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Project name")).toBeInTheDocument();
});

test("Dashboard create form has cancel button", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText("+ New Project"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Create New Project")).not.toBeInTheDocument();
});

test("Dashboard creating a project shows it in the list", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText("+ New Project"));
    const nameInput = screen.getByPlaceholderText("Project name");
    fireEvent.change(nameInput, { target: { value: "Test App" } });
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("Test App")).toBeInTheDocument();
});

test("Dashboard project card shows Open and Delete buttons", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText("+ New Project"));
    fireEvent.change(screen.getByPlaceholderText("Project name"), {
        target: { value: "My App" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
});

test("Dashboard Open button calls onOpenProject", () => {
    const onOpen = jest.fn();
    render(<Dashboard onOpenProject={onOpen} />);
    fireEvent.click(screen.getByText("+ New Project"));
    fireEvent.change(screen.getByPlaceholderText("Project name"), {
        target: { value: "Click Test" },
    });
    fireEvent.click(screen.getByText("Create"));
    fireEvent.click(screen.getByText("Open"));
    expect(onOpen).toHaveBeenCalledTimes(1);
});

test("Dashboard Delete button removes project", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText("+ New Project"));
    fireEvent.change(screen.getByPlaceholderText("Project name"), {
        target: { value: "Deletable App" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("Deletable App")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Deletable App")).not.toBeInTheDocument();
});

test("Dashboard loading a demo project adds it to the list", () => {
    render(<Dashboard onOpenProject={() => undefined} />);
    fireEvent.click(screen.getByText(/Load Demo: Todo App/i));
    expect(screen.queryByText(/No projects yet/i)).not.toBeInTheDocument();
});
