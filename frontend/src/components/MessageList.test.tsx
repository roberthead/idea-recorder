import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import MessageList from "./MessageList";

vi.mock("../api/messages", async () => {
  const actual = await vi.importActual("../api/messages");
  return {
    ...actual,
    useMessages: vi.fn(),
  };
});

import { useMessages } from "../api/messages";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

test("shows empty state when no messages", () => {
  vi.mocked(useMessages).mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useMessages>);

  render(<MessageList />, { wrapper });
  expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
});

test("renders messages", () => {
  vi.mocked(useMessages).mockReturnValue({
    data: [
      { id: "1", transcript: "First idea", duration_seconds: null, created_at: new Date().toISOString() },
      { id: "2", transcript: "Second idea", duration_seconds: null, created_at: new Date().toISOString() },
    ],
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useMessages>);

  render(<MessageList />, { wrapper });
  expect(screen.getByText("First idea")).toBeInTheDocument();
  expect(screen.getByText("Second idea")).toBeInTheDocument();
});

test("shows loading state", () => {
  vi.mocked(useMessages).mockReturnValue({
    data: undefined,
    isLoading: true,
    isError: false,
  } as unknown as ReturnType<typeof useMessages>);

  render(<MessageList />, { wrapper });
  const skeletons = document.querySelectorAll(".animate-pulse");
  expect(skeletons.length).toBe(3);
});
