import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

test("App component renders the dashboard", () => {
    render(<App />);
    const heading = screen.getByText(/Drafter Drafter/i);
    expect(heading).toBeInTheDocument();
});
