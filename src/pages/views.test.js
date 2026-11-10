import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ShowsView } from "./Shows";
import { SocialsView } from "./Socials";
import { PressView } from "./Press";
import { AboutUsView } from "./AboutUs";
import { resolveSocialLink } from "../utils/socialPlatforms";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";

// The views are pure, but their modules also export the data-loading
// containers, so keep Firebase out of the test run.
jest.mock("../firebase/config", () => ({ db: {}, auth: {}, storage: {} }));

const show = (id, venue) => ({ id, venue, city: "Den Haag", country: "NL", day: 1, month: "JAN", year: 2026 });

describe("ShowsView", () => {
  it("opens on upcoming shows when something is planned", () => {
    render(<ShowsView upcoming={[show("u1", "Het Paard")]} past={[show("p1", "Melkweg")]} loading={false} />);
    expect(screen.getByRole("button", { name: /upcoming/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Het Paard")).toBeInTheDocument();
    expect(screen.queryByText("Melkweg")).not.toBeInTheDocument();
  });

  it("shows played shows automatically when nothing is planned, and can switch back", () => {
    render(<ShowsView upcoming={[]} past={[show("p1", "Melkweg")]} loading={false} />);
    expect(screen.getByRole("button", { name: /past/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Melkweg")).toBeInTheDocument();
    expect(screen.getByText("Played")).toBeInTheDocument();
    expect(screen.getByText(/no new shows announced yet/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /upcoming/i }));
    expect(screen.getByText(/no upcoming shows announced yet/i)).toBeInTheDocument();
    expect(screen.queryByText("Melkweg")).not.toBeInTheDocument();
  });

  it("waits for both lists before showing anything", () => {
    render(<ShowsView upcoming={[]} past={[]} loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("SocialsView", () => {
  const links = [
    { id: "a", url: "https://www.instagram.com/discarded_band/" },
    { id: "b", url: "https://discarded.bandcamp.com", description: "Buy the EP" },
    { id: "c", url: "https://www.tiktok.com/@discarded", label: "TikTok clips" },
  ].map(resolveSocialLink);

  it("renders a card per link with title, handle and a safe external link", () => {
    render(<SocialsView heading="Socials" intro="Follow us" links={links} />);
    const cards = screen.getAllByRole("link");
    expect(cards).toHaveLength(3);
    expect(within(cards[0]).getByText("Instagram")).toBeInTheDocument();
    expect(within(cards[0]).getByText("@discarded_band")).toBeInTheDocument();
    expect(within(cards[1]).getByText("Buy the EP")).toBeInTheDocument();
    expect(within(cards[2]).getByText("TikTok clips")).toBeInTheDocument();
    cards.forEach((card) => {
      expect(card).toHaveAttribute("target", "_blank");
      expect(card).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});

describe("PressView", () => {
  const renderPress = (press) =>
    render(<PressView press={press} aboutIntroHtml="<p>Humanity feels discarded.</p>" socials={[]} />);

  it("uses the About Us intro as manifesto and hides empty sections", () => {
    renderPress({ genreLine: "Thall and blackened deathcore", quotes: [] });
    expect(screen.getByText("Thall and blackened deathcore")).toBeInTheDocument();
    expect(screen.getByText("Humanity feels discarded.")).toBeInTheDocument();
    expect(screen.queryByText(/what the press says/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tech rider/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/video/i)).not.toBeInTheDocument();
    // Booking is always there.
    expect(screen.getByText("discardedsoftrock@gmail.com")).toBeInTheDocument();
  });

  it("shows quotes, the video and the rider once they're filled in", () => {
    renderPress({
      genreLine: "",
      manifestoHtml: "<p>Our own manifesto.</p>",
      quotes: [
        { id: "1", text: "Crushing.", source: "The Metalverse", url: "https://example.com/review" },
        { id: "2", text: "", source: "Metal Noise" }, // empty quotes stay hidden
      ],
      videoTitle: "Ashes",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      rider: { url: "https://example.com/rider.pdf", size: 1536000 },
    });
    expect(screen.getByText("Our own manifesto.")).toBeInTheDocument();
    expect(screen.queryByText("Humanity feels discarded.")).not.toBeInTheDocument();
    expect(screen.getByText("Crushing.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Metalverse" })).toHaveAttribute("href", "https://example.com/review");
    expect(screen.queryByText("Metal Noise")).not.toBeInTheDocument();
    expect(screen.getByTitle("Ashes (video)")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0"
    );
    expect(screen.getByText(/PDF, 1.5 MB/)).toBeInTheDocument();
  });
});

describe("AboutUsView", () => {
  it("renders headings and band members from the saved data", () => {
    render(
      <AboutUsView
        data={{
          ...DEFAULT_ABOUT_US,
          title: "Who we are",
          bandTitle: "Line-up",
          members: [
            { role: "Vocals", name: "Andy Meijer" },
            { role: "", name: "Guest Player" },
            { role: "Bass", name: "   " }, // empty names are skipped
          ],
        }}
      />
    );
    expect(screen.getByRole("heading", { name: "Who we are" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Line-up" })).toBeInTheDocument();
    expect(screen.getByText("Vocals: Andy Meijer")).toBeInTheDocument();
    expect(screen.getByText("Guest Player")).toBeInTheDocument();
    expect(screen.queryByText(/Bass/)).not.toBeInTheDocument();
  });
});
