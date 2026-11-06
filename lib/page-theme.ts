export interface PageTheme {
  a: string;
  b: string;
  c: string;
  wash: string;
  soft: string;
  glow: string;
}

/** One palette for the whole app: purple, sage, lavender. */
export const BASE_THEME: PageTheme = {
  a: "#312e81",
  b: "#0b534c",
  c: "#c4b5e0",
  wash: "#efeaf8",
  soft: "rgba(49, 46, 129, 0.22)",
  glow: "rgba(49, 46, 129, 0.4)",
};

export function themeForPath(_pathname: string): PageTheme {
  return BASE_THEME;
}
