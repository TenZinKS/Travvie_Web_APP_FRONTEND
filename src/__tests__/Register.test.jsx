import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../pages/Auth/Signup";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

function renderRegister() {
  return render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
}

beforeEach(() => {
  window.alert = vi.fn();
  Object.defineProperty(window, 'location', {
    value: { href: '', assign: vi.fn() },
    writable: true,
  });
});

describe("Signup Page", () => {
  it("renders signup form", () => {
    renderRegister();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("allows typing into fields", () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "tenzin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Tenzin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText(/email/i).value).toBe("tenzin@example.com");
    expect(screen.getByPlaceholderText(/name/i).value).toBe("Tenzin");
    expect(screen.getByPlaceholderText(/^password$/i).value).toBe("password123");
    expect(screen.getByPlaceholderText(/confirm password/i).value).toBe("password123");
  });

  it("shows error if passwords do not match", () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "different" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
  });

  it("calls API on successful signup", async () => {
    axios.post.mockResolvedValue({
      data: { msg: "User registered successfully" },
    });

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "tenzin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Tenzin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/api/auth/register",
        expect.objectContaining({
          name: "Tenzin",
          email: "tenzin@example.com",
          password: "password123",
        })
      );
      expect(window.alert).toHaveBeenCalledWith("User registered successfully");
    });
  });

  it("shows error if user already exists", async () => {
    axios.post.mockRejectedValue({
      response: { data: { msg: "User already exists" } },
    });

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "tenzin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Tenzin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User already exists");
    });
  });
});
