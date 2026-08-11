const HEBREW_REGEX = /[֐-׿]/;

export function isHebrewText(text = "") {
  return HEBREW_REGEX.test(text);
}

/**
 * Returns categories filtered to what should actually appear on a printed menu:
 * hidden categories are dropped, categories with no visible dishes are dropped,
 * hidden dishes are dropped. Does NOT filter by hasTimeLimit/isCategoryActive —
 * a printed menu is a static document, not a live view.
 */
export function getPrintableCategories(menuCategories = []) {
  return menuCategories
    .filter((category) => !category.hide)
    .map((category) => ({
      ...category,
      menuDishes: (category.menuDishes || []).filter((dish) => !dish.hide),
    }))
    .filter((category) => category.menuDishes.length > 0);
}

const AVG_DISHES_PER_PAGE = {
  premium: 11,
  compact: 15,
};

/**
 * Rough heuristic page-count estimate for the "≈ N pages" badge.
 * Not a real pagination engine — the browser lays out actual pages at print time.
 */
export function estimatePrintPageCount(menuCategories = [], layout = "premium") {
  const printableCategories = getPrintableCategories(menuCategories);
  const totalDishes = printableCategories.reduce(
    (sum, category) => sum + category.menuDishes.length,
    0,
  );
  if (totalDishes === 0) return 0;

  const perPage = AVG_DISHES_PER_PAGE[layout] || AVG_DISHES_PER_PAGE.premium;
  // Each category header eats into the same page's capacity as ~0.5 dish worth of space.
  const effectiveUnits = totalDishes + printableCategories.length * 0.5;
  return Math.max(1, Math.ceil(effectiveUnits / perPage));
}
