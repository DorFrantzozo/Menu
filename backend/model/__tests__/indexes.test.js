import { describe, it, expect } from "vitest";

import ActivityLog from "../activityLog.js";
import Category from "../category.js";
import Dish from "../dish.js";
import Payment from "../payment.js";
import Asset from "../assets.js";

function hasIndexOn(schema, field, matchOptions) {
  return schema.indexes().some(([keys, options]) => {
    if (!(field in keys)) return false;
    if (!matchOptions) return true;
    return Object.entries(matchOptions).every(([k, v]) => options?.[k] === v);
  });
}

describe("model indexes", () => {
  it("ActivityLog has a TTL index that expires raw events after 90 days", () => {
    expect(
      hasIndexOn(ActivityLog.schema, "timestamp", {
        expireAfterSeconds: 60 * 60 * 24 * 90,
      })
    ).toBe(true);
  });

  it("Category, Dish, Payment and Asset are indexed on userId", () => {
    expect(hasIndexOn(Category.schema, "userId")).toBe(true);
    expect(hasIndexOn(Dish.schema, "userId")).toBe(true);
    expect(hasIndexOn(Payment.schema, "userId")).toBe(true);
    expect(hasIndexOn(Asset.schema, "userId")).toBe(true);
  });

  it("Dish is indexed on category", () => {
    expect(hasIndexOn(Dish.schema, "category")).toBe(true);
  });
});
