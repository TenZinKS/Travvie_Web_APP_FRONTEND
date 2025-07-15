import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "../pages/Dashboard_Menu/Home.jsx";
import * as routerDom from "react-router-dom";
import axios from "axios";

// Mock router hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock axios
vi.mock("axios");

beforeEach(() => {
  // Fake user in localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({ id: "user-123", name: "Test User" })
  );
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("Home Page", () => {
  it("renders travel dashboard title", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /my travel dashboard/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:4000/api/trips/user/user-123"
      );
    });
  });

  it("shows travel stats fetched from API", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: "t1", status: "completed" },
      { id: "t2", status: "wishlist" },
      { id: "t3", status: "cancelled" },
      { id: "t4", status: "upcoming" },
      { id: "t5", status: "completed" },
    ],
  });

  render(<Home />);

  await waitFor(() => {
    expect(screen.getByText(/completed trips/i)).toBeInTheDocument();
    expect(screen.getByText(/wishlist trips/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelled trips/i)).toBeInTheDocument();
    expect(screen.getByText(/upcoming trips/i)).toBeInTheDocument();

    // Check correct numbers in each card
    const completedCard = screen.getByText(/completed trips/i).closest(".card");
    expect(completedCard).toHaveTextContent("2");

    const wishlistCard = screen.getByText(/wishlist trips/i).closest(".card");
    expect(wishlistCard).toHaveTextContent("1");

    const cancelledCard = screen.getByText(/cancelled trips/i).closest(".card");
    expect(cancelledCard).toHaveTextContent("1");

    const upcomingCard = screen.getByText(/upcoming trips/i).closest(".card");
    expect(upcomingCard).toHaveTextContent("1");
  });
});


  it("shows travel tip", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/travel tip/i)).toBeInTheDocument();
    });
  });

  it("navigates when clicking a stat card", async () => {
    const navigate = vi.fn();
    routerDom.useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Home />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText(/completed trips/i));

    expect(navigate).toHaveBeenCalledWith(
      "/dashboard/my_trips?status=completed"
    );
  });
});
