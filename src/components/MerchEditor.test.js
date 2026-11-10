import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MerchEditor from "./MerchEditor";

// A tiny in-memory stand-in for Firestore.
const mockDocs = {};
const mockSetDoc = jest.fn(() => Promise.resolve());
let mockGetDocFails = false;

jest.mock("../firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: (_db, collection, id) => `${collection}/${id}`,
  getDoc: (path) =>
    mockGetDocFails
      ? Promise.reject(new Error("offline"))
      : Promise.resolve({ exists: () => path in mockDocs, data: () => mockDocs[path] }),
  setDoc: (...args) => mockSetDoc(...args),
  serverTimestamp: () => "NOW",
}));

const synced = (extra = {}) => ({
  items: [
    {
      id: "990053206",
      title: "Logo T-Shirt (includes digital album)",
      type: "Shirt",
      url: "https://discardedband.bandcamp.com/merch/logo-t-shirt-includes-digital-album",
      priceText: "€20",
      soldOut: false,
      thumbUrl: "https://f4.bcbits.com/img/0040947427_36.jpg",
    },
    {
      id: "1240823959",
      title: "Premium Oversized T-Shirt (includes free CD copy)",
      type: "Shirt",
      url: "https://discardedband.bandcamp.com/merch/premium-oversized-t-shirt-includes-free-cd-copy",
      priceText: "",
      soldOut: true,
    },
  ],
  syncedAt: { toDate: () => new Date() },
  lastError: null,
  ...extra,
});

beforeEach(() => {
  Object.keys(mockDocs).forEach((k) => delete mockDocs[k]);
  mockSetDoc.mockClear();
  mockGetDocFails = false;
});

it("shows the last sync and saves which items are hidden", async () => {
  mockDocs["site_content/merch"] = synced();
  render(<MerchEditor />);

  expect(await screen.findByText(/last synced/i)).toHaveTextContent("(today), 2 items");
  const shirt = screen.getByRole("checkbox", { name: /logo t-shirt/i });
  expect(shirt).toBeChecked();

  fireEvent.click(shirt);
  fireEvent.click(screen.getByRole("button", { name: /save merch settings/i }));

  await waitFor(() => expect(mockSetDoc).toHaveBeenCalledTimes(1));
  const [path, data, options] = mockSetDoc.mock.calls[0];
  expect(path).toBe("site_content/merchSettings");
  expect(data.hidden).toEqual(["990053206"]);
  expect(options).toEqual({ merge: true });
  expect(await screen.findByText(/saved/i)).toBeInTheDocument();
});

it("explains a failed sync and that the old list stays up", async () => {
  mockDocs["site_content/merch"] = synced({ lastError: "Bandcamp answered 503", lastCheckAt: { toDate: () => new Date() } });
  render(<MerchEditor />);
  expect(await screen.findByText(/failed: Bandcamp answered 503/i)).toHaveTextContent(/keeps showing the list above/i);
});

it("tells you how to start when nothing has synced yet", async () => {
  render(<MerchEditor />);
  expect(await screen.findByText(/not synced yet/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /run the sync once/i })).toHaveAttribute(
    "href",
    expect.stringContaining("/actions/workflows/sync-merch.yml")
  );
});

it("won't save over real settings when loading failed", async () => {
  mockGetDocFails = true;
  render(<MerchEditor />);
  expect(await screen.findByText(/saving is switched off/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /save merch settings/i })).toBeDisabled();
});
