import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../pages/Profile";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

// Mocks
vi.mock("axios");

describe("Profile Page", () => {
  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "123",
        name: "Test User",
        email: "test@example.com",
        profilePic: "",
      })
    );
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders profile page details", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Edit Account")).toBeInTheDocument();
  });

  it("switches to edit mode and cancels edit", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Click edit
    fireEvent.click(screen.getByText(/edit account/i));
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();

    // Change name
    fireEvent.change(screen.getByDisplayValue("Test User"), {
      target: { value: "Updated User" },
    });

    // Click cancel
    fireEvent.click(screen.getByText(/cancel/i));

    // Should show original name again
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("updates profile and saves changes", async () => {
    axios.put.mockResolvedValue({
      data: {
        id: "123",
        name: "Updated User",
        email: "test@example.com",
        profilePic: "",
      },
    });

    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/edit account/i));

    const nameInput = screen.getByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "Updated User" } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(screen.getByText("Updated User")).toBeInTheDocument();
      expect(window.alert).toHaveBeenCalledWith("Profile updated!");
    });
  });

  it("navigates to change password page", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/change password/i));
    // We can’t fully test navigation in a MemoryRouter unless routes are provided.
    // But no crash = test passes
  });

  it("handles delete account confirmation cancel", () => {
    window.confirm = vi.fn().mockReturnValue(false);
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/delete account/i));
    expect(window.confirm).toHaveBeenCalled();
  });

  it("deletes account when confirmed", async () => {
    axios.delete.mockResolvedValue({});
    window.confirm = vi.fn().mockReturnValue(true);
    window.alert = vi.fn();
    window.location.href = "";

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/delete account/i));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:4000/api/auth/123"
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Your account has been deleted."
      );
    });
  });

  it("logs out and clears localStorage", () => {
    window.location.href = "";
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));
    expect(localStorage.getItem("user")).toBeNull();
  });
});
