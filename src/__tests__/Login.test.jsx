import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Auth/Login";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe("Login Page", () => {
  it("renders login form", () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("allows typing", () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "pass123" } });
    expect(passwordInput.value).toBe("pass123");
  });

  it("calls API on submit", async () => {
    axios.post.mockResolvedValue({
      data: {
        token: "fake-token",
        user: { name: "Test User", id: "123" },
      },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/api/auth/login",
        expect.objectContaining({
          email: "test@example.com",
          password: "password",
        })
      );
    });
  });

  it("shows error on bad credentials", async () => {
    axios.post.mockRejectedValue({
      response: { data: { msg: "Invalid credentials" } },
    });

    window.alert = vi.fn();

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
