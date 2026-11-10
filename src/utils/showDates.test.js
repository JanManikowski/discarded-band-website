import { pickDefaultShowsTab } from "./showDates";

describe("pickDefaultShowsTab", () => {
  it("opens on upcoming shows when something is planned", () => {
    expect(pickDefaultShowsTab(2, 10)).toBe("upcoming");
  });

  it("switches to played shows when nothing is planned", () => {
    expect(pickDefaultShowsTab(0, 4)).toBe("past");
  });

  it("stays on upcoming when there are no shows at all", () => {
    expect(pickDefaultShowsTab(0, 0)).toBe("upcoming");
  });
});
