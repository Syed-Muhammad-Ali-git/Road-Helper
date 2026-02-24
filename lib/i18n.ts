export type Lang = "en" | "ur" | "rm";

export const LANGUAGES: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
  { code: "rm", label: "RM", dir: "ltr" },
];

export function getLangDir(lang: Lang): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}

export function applyLangToDocument(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", getLangDir(lang));
}
