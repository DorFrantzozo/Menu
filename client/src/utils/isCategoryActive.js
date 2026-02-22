/**
 * Determines if a category should be visible to customers right now,
 * based on its scheduling settings (hasTimeLimit, activeDays, startTime, endTime).
 *
 * Handles midnight-spanning time ranges (e.g. 22:00 → 02:00) correctly.
 *
 * @param {Object} category - A category document from the DB
 * @returns {boolean}
 */
export function isCategoryActive(category) {
  // No time limit set — always active
  if (!category.hasTimeLimit) return true;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday … 6 = Saturday

  // ── Day Check ────────────────────────────────────────────────────────────
  if (category.activeDays && category.activeDays.length > 0) {
    if (!category.activeDays.includes(currentDay)) return false;
  }

  // ── Time Check ───────────────────────────────────────────────────────────
  if (category.startTime && category.endTime) {
    const pad = (n) => String(n).padStart(2, "0");
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const start = category.startTime;
    const end = category.endTime;

    if (start <= end) {
      // Normal daytime range (e.g. 08:00 → 17:00)
      if (currentTime < start || currentTime > end) return false;
    } else {
      // Midnight-spanning range (e.g. 22:00 → 02:00)
      // Active if AFTER start OR BEFORE end
      if (currentTime < start && currentTime > end) return false;
    }
  }

  return true;
}
