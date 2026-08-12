// Call this before any script that writes to or deletes from MongoDB. Refuses
// to run against anything but an explicitly-marked dev database, because
// MONGO_URL today points at the same live production data every script,
// test run, and local server share (see IME-21).
//
// DB_ENV is dedicated to this check on purpose — NODE_ENV already defaults to
// "development" when unset (see errorHandler.js), and the real production
// server has never set it, so reusing NODE_ENV would let this guard silently
// wave production through.
export function assertDevDatabase(scriptName) {
  const dbEnv = (process.env.DB_ENV || "").toLowerCase();
  const forced =
    process.argv.includes("--force") && process.env.CONFIRM_PRODUCTION === "yes";

  if (dbEnv === "development") {
    return;
  }

  if (forced) {
    console.warn(
      `[${scriptName}] DB_ENV is not "development" but running anyway because ` +
        `--force was passed with CONFIRM_PRODUCTION=yes. Make sure this is intentional.`
    );
    return;
  }

  console.error(
    `[${scriptName}] Refusing to run: DB_ENV is not set to "development" ` +
      `(current value: ${JSON.stringify(process.env.DB_ENV || "")}).\n\n` +
      `This script writes to the database. Set DB_ENV=development in your .env ` +
      `to point at a dev database before running it.\n` +
      `If you really need to run this against production, re-run with ` +
      `--force and CONFIRM_PRODUCTION=yes set in the environment.`
  );
  process.exit(1);
}
