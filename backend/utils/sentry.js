import * as Sentry from "@sentry/node";

// No-op unless SENTRY_DSN is set, so the app behaves exactly as before in
// any environment that hasn't been given a DSN yet (e.g. local dev today).
let initialized = false;

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.log("SENTRY_DSN not set — error tracking disabled.");
    return;
  }
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DB_ENV || "production",
  });
  initialized = true;
  console.log("Sentry error tracking initialized.");
}

export function captureError(err) {
  if (initialized) Sentry.captureException(err);
}

// Sentry sends events over the network asynchronously; call this before
// process.exit() (e.g. after an uncaught exception) or the event can be
// dropped mid-flight.
export async function flushSentry(timeoutMs = 2000) {
  if (initialized) await Sentry.flush(timeoutMs);
}
