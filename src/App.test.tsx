import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { business, navItems } from "./data/siteContent";

function setMediaQuery(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function renderRoute(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("Ryco Coffee House site", () => {
  beforeEach(() => {
    setMediaQuery(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the approved six-page navigation with Ryco business facts", () => {
    renderRoute();

    for (const item of navItems) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }

    expect(screen.getByRole("heading", { level: 1, name: /RYCO/i })).toBeInTheDocument();
    expect(screen.getByText(business.address)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call 07749 175885/i })).toHaveAttribute(
      "href",
      "tel:+447749175885"
    );
  });

  it("shows supplied opening hours with Tuesday closed", () => {
    const { container } = renderRoute("/visit");

    const hours = screen.getByTestId("opening-hours");
    expect(within(hours).getByText(/Monday/i)).toBeInTheDocument();
    expect(within(hours).getAllByText(/9am-4:30pm/i)).toHaveLength(4);
    expect(within(hours).getByText(/Tuesday/i)).toBeInTheDocument();
    expect(within(hours).getByText(/Closed/i)).toBeInTheDocument();
    expect(within(hours).getByText(/Saturday/i)).toBeInTheDocument();
    expect(within(hours).getByText(/8am-4pm/i)).toBeInTheDocument();
    expect(within(hours).getByText(/Sunday/i)).toBeInTheDocument();
    expect(within(hours).getByText(/9am-3pm/i)).toBeInTheDocument();
    expect([...container.querySelectorAll("img")].some((image) => image.getAttribute("src")?.includes("opening-hours"))).toBe(
      false
    );
  });

  it("does not render the removed opening-hours graphic in the gallery", () => {
    const { container } = renderRoute("/gallery");

    expect([...container.querySelectorAll("img")].some((image) => image.getAttribute("src")?.includes("opening-hours"))).toBe(
      false
    );
    expect(screen.queryByText("Opening hours")).not.toBeInTheDocument();
  });

  it("renders menu highlights from researched Ryco content", () => {
    renderRoute("/menu");

    for (const item of ["Coffee", "Acai bowls", "Smoothies", "Traybakes", "Toasties", "Overnight oats"]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("adds customer-facing menu photos without generic website copy", () => {
    renderRoute("/menu");

    const photoRail = screen.getByRole("region", { name: /menu photos/i });
    expect(within(photoRail).getByRole("img", { name: /acai bowl and coffee/i })).toHaveAttribute(
      "src",
      "/images/ryco-restaurantji-photo-mobile.jpg"
    );
    expect(within(photoRail).getByRole("img", { name: /ryco storefront/i })).toHaveAttribute(
      "src",
      "/images/ryco-restaurantguru-photo.jpg"
    );
    expect(screen.queryByText(/public photos/i)).not.toBeInTheDocument();
  });

  it("keeps gallery copy focused on the coffee shop instead of site sourcing", () => {
    renderRoute("/gallery");

    expect(screen.getByText(/Storefront, coffee, bowls and house favourites/i)).toBeInTheDocument();
    expect(screen.queryByText(/public photos/i)).not.toBeInTheDocument();
  });

  it("exposes static-safe contact and directions actions", () => {
    renderRoute("/contact");

    expect(screen.getAllByRole("link", { name: /call 07749 175885/i })[0]).toHaveAttribute(
      "href",
      "tel:+447749175885"
    );
    expect(screen.getByRole("link", { name: /directions/i })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps")
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("opens and closes the compact mobile menu", async () => {
    const user = userEvent.setup();
    renderRoute();

    const button = screen.getByRole("button", { name: /open menu/i });
    await user.click(button);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: "Gallery" }));
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("uses section anchors for desktop header navigation", () => {
    setMediaQuery(true);
    renderRoute("/");

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#home");
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/#menu");
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute("href", "/#gallery");
    expect(screen.queryByRole("button", { name: /open menu/i })).not.toBeInTheDocument();
  });

  it("keeps routed header navigation on mobile", () => {
    renderRoute("/");

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute("href", "/gallery");
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("renders desktop subroutes through the full scroll page", () => {
    setMediaQuery(true);
    const { container } = renderRoute("/gallery");

    expect(container.querySelector(".desktop-scroll-page")).toBeInTheDocument();
    expect(container.querySelector("#gallery")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "RYCO" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Gallery" })).toBeInTheDocument();
  });
});
