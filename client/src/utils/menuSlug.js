// Works out which restaurant a menu URL points at.
//
// In production a menu lives on <slug>.imenu-il.online, so the slug is the
// first label of a three-label hostname. Locally that test fails: browsers
// resolve any *.localhost name to loopback, but <slug>.localhost has only two
// labels, so a plain "parts.length >= 3" check reports no slug at all and the
// menu renders "not found".
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

// Labels that belong to the platform, never to a restaurant. Without this,
// www.imenu-il.online/menu looks up a restaurant called "www".
const RESERVED_LABELS = new Set(["www"]);

export const getSlugFromHostname = (
  hostname = typeof window !== "undefined" ? window.location.hostname : "",
) => {
  const host = (hostname || "").toLowerCase();
  if (!host) return null;

  // 127.0.0.1 splits into four labels and would otherwise yield "127".
  if (IPV4.test(host)) return null;

  let candidate;
  if (host.endsWith(".localhost")) {
    // Local development: <slug>.localhost
    [candidate] = host.split(".");
  } else {
    const parts = host.split(".");
    candidate = parts.length >= 3 ? parts[0] : null;
  }

  if (!candidate || RESERVED_LABELS.has(candidate)) return null;
  return candidate;
};

export default getSlugFromHostname;
