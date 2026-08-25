import {describe, it, expect} from "vitest";
import {
  normalizeReviewUrl,
  isReviewPromptReady,
  coercePromptDelay,
} from "../reviewUrl.js";

describe("normalizeReviewUrl", () => {
  it("treats an empty field as unset rather than an error", () => {
    for (const input of ["", "   ", null, undefined]) {
      expect(normalizeReviewUrl(input).urlStatus).toBe("unset");
    }
  });

  it("accepts the Business Profile review link", () => {
    const res = normalizeReviewUrl("https://g.page/r/CxYzAbC123/review");
    expect(res.urlStatus).toBe("valid");
    expect(res.resolvedUrl).toBe("https://g.page/r/CxYzAbC123/review");
  });

  it("adds the missing scheme owners usually leave off", () => {
    const res = normalizeReviewUrl("g.page/r/CxYzAbC123/review");
    expect(res.urlStatus).toBe("valid");
    expect(res.resolvedUrl).toBe("https://g.page/r/CxYzAbC123/review");
  });

  it("keeps the raw input so the form can show it back", () => {
    const res = normalizeReviewUrl("  g.page/r/Abc/review  ");
    expect(res.googleReviewUrl).toBe("g.page/r/Abc/review");
  });

  it("upgrades a place id into a direct write-review link", () => {
    const res = normalizeReviewUrl(
      "https://www.google.com/maps/place/x?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    );
    expect(res.urlStatus).toBe("valid");
    expect(res.resolvedUrl).toBe(
      "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    );
  });

  it("accepts an existing writereview link unchanged in meaning", () => {
    const res = normalizeReviewUrl(
      "https://search.google.com/local/writereview?placeid=ChIJabc",
    );
    expect(res.urlStatus).toBe("valid");
    expect(res.resolvedUrl).toContain("placeid=ChIJabc");
  });

  it("accepts short links without trying to follow them", () => {
    const res = normalizeReviewUrl("https://maps.app.goo.gl/aBcDeF123");
    expect(res.urlStatus).toBe("valid");
    expect(res.resolvedUrl).toBe("https://maps.app.goo.gl/aBcDeF123");
  });

  it("accepts non-.com Google domains", () => {
    expect(normalizeReviewUrl("https://www.google.co.il/maps/place/abc").urlStatus).toBe(
      "valid",
    );
  });

  it("rejects a non-Google host", () => {
    for (const input of [
      "https://example.com/review",
      "https://gooogle.com/maps/place/x",
      "https://tripadvisor.com/x",
      "https://notgoogle.com/maps",
    ]) {
      expect(normalizeReviewUrl(input).urlStatus).toBe("invalid");
    }
  });

  it("rejects the Google homepage, which points at no business", () => {
    for (const input of ["https://www.google.com", "google.com/", "https://g.page"]) {
      expect(normalizeReviewUrl(input).urlStatus).toBe("invalid");
    }
  });

  it("rejects text that is not a url at all", () => {
    for (const input of ["not a url", "http://", "javascript:alert(1)"]) {
      expect(normalizeReviewUrl(input).urlStatus).toBe("invalid");
    }
  });

  it("never returns a resolvedUrl for an invalid input", () => {
    expect(normalizeReviewUrl("https://example.com").resolvedUrl).toBe("");
  });
});

describe("isReviewPromptReady", () => {
  const ready = {
    isEnabled: true,
    urlStatus: "valid",
    resolvedUrl: "https://g.page/r/Abc/review",
  };

  it("is true only when enabled, valid and resolvable", () => {
    expect(isReviewPromptReady(ready)).toBe(true);
  });

  it("is false when the owner switched it off", () => {
    expect(isReviewPromptReady({...ready, isEnabled: false})).toBe(false);
  });

  it("is false when the link never validated", () => {
    expect(isReviewPromptReady({...ready, urlStatus: "invalid"})).toBe(false);
    expect(isReviewPromptReady({...ready, urlStatus: "unset"})).toBe(false);
  });

  it("is false when there is nothing to link to", () => {
    expect(isReviewPromptReady({...ready, resolvedUrl: ""})).toBe(false);
  });

  it("is false for a user that has never touched the feature", () => {
    expect(isReviewPromptReady(undefined)).toBe(false);
    expect(isReviewPromptReady({})).toBe(false);
  });
});

describe("coercePromptDelay", () => {
  it("keeps the venue presets intact", () => {
    expect(coercePromptDelay(10)).toBe(10);
    expect(coercePromptDelay(25)).toBe(25);
    expect(coercePromptDelay(45)).toBe(45);
  });

  it("falls back to the default for junk", () => {
    expect(coercePromptDelay("abc")).toBe(15);
    expect(coercePromptDelay(undefined)).toBe(15);
  });

  it("clamps values that could never fire", () => {
    expect(coercePromptDelay(0)).toBe(5);
    expect(coercePromptDelay(-30)).toBe(5);
    // Past the client's 4-hour visit window the prompt would never appear.
    expect(coercePromptDelay(9999)).toBe(240);
  });

  it("accepts numeric strings from form data", () => {
    expect(coercePromptDelay("25")).toBe(25);
  });
});
