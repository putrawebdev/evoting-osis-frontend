import { render, screen } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { getRouter } from "@/router";

describe("mobile responsive layout", () => {
  it("menggunakan layout satu kolom di mobile dan tiga kolom di layar kecil ke atas", () => {
    const router = getRouter();
    router.navigate({ to: "/login" });
    const { container } = render(<RouterProvider router={router} />);

    const posterGrid = Array.from(document.querySelectorAll("div")).find(
      (node) => node.className.includes("grid") && node.textContent?.includes("Paslon 1"),
    );

    expect(screen.getByText("Kenali pasangan calon")).toBeInTheDocument();
    expect(posterGrid).toBeTruthy();
    expect(posterGrid).toHaveClass("grid-cols-1");
    expect(posterGrid).toHaveClass("sm:grid-cols-3");
    expect(container.firstChild).not.toBeNull();
  });
});
