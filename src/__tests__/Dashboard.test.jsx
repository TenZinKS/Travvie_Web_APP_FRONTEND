import { describe, it, expect, vi, beforeAll } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useNavigate } from "react-router-dom";

function renderDashboard() {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}

beforeAll(() => {
  vi.stubGlobal("alert", vi.fn());
});

describe("Dashboard", () => {
  it("renders sidebar initially", () => {
    renderDashboard();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders logo image", () => {
    renderDashboard();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });

  it("renders all sidebar menu items", () => {
    renderDashboard();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Create Trip")).toBeInTheDocument();
    expect(screen.getByText("My Trips")).toBeInTheDocument();
    expect(screen.getByText("Saved Trips")).toBeInTheDocument();
  });

  it("hides sidebar when toggle clicked", () => {
    renderDashboard();
    const toggle = screen.getByTestId("toggle-button");
    fireEvent.click(toggle);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("shows sidebar again after second toggle click", () => {
    renderDashboard();
    const toggle = screen.getByTestId("toggle-button");
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("navigates when clicking sidebar items", () => {
    const navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);

    renderDashboard();
    fireEvent.click(screen.getByText("Create Trip"));
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/create_trip");
  });

  it("navigates when clicking profile icon", () => {
    const navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);

    renderDashboard();
    fireEvent.click(screen.getByTestId("profile-icon"));
    expect(navigateMock).toHaveBeenCalledWith("/profile");
  });

  it("shows top bar title", () => {
    renderDashboard();
    expect(screen.getByText("Travvie")).toBeInTheDocument();
  });

  it("renders Outlet placeholder", () => {
    renderDashboard();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("has tooltips for menu items if defined", () => {
    renderDashboard();
    expect(
      screen.getByTitle(
        "View and manage your trips, whether planned, upcoming, or completed."
      )
    ).toBeInTheDocument();
  });
});
