export const design3Config = {
  supportsLikes: false,
  supportsImages: false,
  supportsSubCategories: true,
  supportsReviewPrompt: true,
  // The only dark design. A light overlay surface would read as a foreign
  // object here, which is the whole reason this palette lives in config.
  theme: {
    surface: "#16161A",
    text: "#F5F5F5",
    muted: "#94A3B8",
    border: "#2B2B33",
    accent: "#E5D3C5",
    accentText: "#0C0C0E",
    radius: "0.375rem",
  },
};
