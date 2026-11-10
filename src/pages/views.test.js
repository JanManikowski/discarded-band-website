import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ShowsView } from "./Shows";
import { SocialsView } from "./Socials";
import { PressView } from "./Press";
import { AboutUsView } from "./AboutUs";
import { MerchView } from "./Merch";
import { prepareMerchItems } from "../utils/merch";
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

describe("MerchView", () => {
  const items = prepareMerchItems([
    {
      id: "1",
      title: "Premium Oversized T-Shirt (includes free CD copy)",
      type: "Shirt",
      url: "https://discardedband.bandcamp.com/merch/premium",
      soldOut: true,
      thumbUrl: "https://f4.bcbits.com/img/0040947399_36.jpg",
    },
    {
      id: "2",
      title: "Logo T-Shirt (includes digital album)",
      type: "Shirt",
      url: "https://discardedband.bandcamp.com/merch/logo-t-shirt-includes-digital-album",
      priceText: "€20",
      soldOut: false,
      imageUrl: "https://f4.bcbits.com/img/0040947427_10.jpg",
    },
  ]);

  it("shows each item as a link to Bandcamp, sold-out items last", () => {
    render(<MerchView items={items} intro="Shirts and CDs" loading={false} />);
    const cards = screen.getAllByRole("link", { name: /opens on bandcamp/i });
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("href", "https://discardedband.bandcamp.com/merch/logo-t-shirt-includes-digital-album");
    expect(within(cards[0]).getByText("Logo T-Shirt")).toBeInTheDocument();
    expect(within(cards[0]).getByText("Includes digital album")).toBeInTheDocument();
    expect(within(cards[0]).getByText("€20")).toBeInTheDocument();
    expect(within(cards[1]).getAllByText(/sold out/i).length).toBeGreaterThan(0);
    cards.forEach((card) => expect(card).toHaveAttribute("rel", "noopener noreferrer"));
  });

  it("sends people to Bandcamp when nothing has synced yet", () => {
    render(<MerchView items={[]} intro="" loading={false} />);
    expect(screen.getByRole("link", { name: /visit our bandcamp/i })).toHaveAttribute(
      "href",
      "https://discardedband.bandcamp.com/merch"
    );
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
