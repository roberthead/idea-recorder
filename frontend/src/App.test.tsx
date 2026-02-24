import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./api/messages", async () => {
  const actual = await vi.importActual("./api/messages");
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

test("renders the app with heading", () => {
  render(<App />, { wrapper });
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
