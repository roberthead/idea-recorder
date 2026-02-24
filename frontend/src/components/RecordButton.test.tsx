import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import RecordButton from "./RecordButton";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

test("renders record button in idle state", () => {
  render(<RecordButton />, { wrapper });
  expect(screen.getByRole("button", { name: /start recording/i })).toBeInTheDocument();
  expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
});
