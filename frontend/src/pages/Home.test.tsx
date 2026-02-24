import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Home from "./Home";

vi.mock("../api/messages", async () => {
  const actual = await vi.importActual("../api/messages");
  return {
    ...actual,
    useMessages: vi.fn().mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    }),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

test("renders record button and message list", () => {
  render(<Home />, { wrapper });
  expect(screen.getByRole("button", { name: /start recording/i })).toBeInTheDocument();
  expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
});
