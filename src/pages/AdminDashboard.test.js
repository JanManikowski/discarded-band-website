import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminDashboardView } from "./AdminDashboard";

// The view is pure; stub what the container next to it imports.
// (This Jest version can't resolve react-router-dom v7's package exports.)
jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock("../contexts/AuthContext", () => ({ useAuth: () => ({ currentUser: null, logout: jest.fn() }) }));
jest.mock("../hooks/useAdminOverview", () => ({ __esModule: true, default: () => ({ overview: {}, loading: false }) }));

describe("AdminDashboardView", () => {
  it("shows every section with what's on the site, and opens it on click", () => {
    const onNavigate = jest.fn();
    render(
      <AdminDashboardView
        overview={{
          shows: { text: "Next: 5 Dec · Het Paard", tone: "normal" },
          press: { text: "Missing: tech rider", tone: "warn" },
        }}
        email="band@example.com"
        onNavigate={onNavigate}
        onLogout={() => {}}
      />
    );

    ["Releases", "About Us", "Gallery", "Shows", "Socials", "Merch", "Press Kit"].forEach((label) => {
      expect(screen.getByRole("button", { name: new RegExp(`^${label}`) })).toBeInTheDocument();
    });
    expect(screen.getByText("Next: 5 Dec · Het Paard")).toBeInTheDocument();
    expect(screen.getByText("Missing: tech rider")).toHaveClass("admin-card-status", "is-warn");
    expect(screen.getByText("Signed in as band@example.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Press Kit/ }));
    expect(onNavigate).toHaveBeenCalledWith("/admin/press");
  });

  it("shows a placeholder line while the overview loads", () => {
    render(<AdminDashboardView loading onNavigate={() => {}} onLogout={() => {}} />);
    expect(screen.getAllByText("…")).toHaveLength(7);
  });
});
