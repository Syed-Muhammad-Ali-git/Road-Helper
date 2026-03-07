import { useLangStore } from "@/store/langStore";
import en from "@/dictionaries/en.json";
import ur from "@/dictionaries/ur.json";
import rm from "@/dictionaries/rm.json";

const dictionaries = { en, ur, rm };

type Dictionary = typeof en;
type NestedPaths<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}.${NestedPaths<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

function getNestedValue(obj: unknown, keyPath: string): unknown {
  const keys = keyPath.split(".");
  let val: unknown = obj;
  for (const k of keys) {
    if (val === undefined || val === null) return undefined;
    val = (val as Record<string, unknown>)[k];
  }
  return val;
}

export function useTranslation() {
  const { lang } = useLangStore();

  const t = (
    key: NestedPaths<Dictionary>,
    params?: Record<string, string | number>
  ): string => {
    const keys = key.split(".");
    let val: unknown = (dictionaries as Record<string, unknown>)[lang];
    for (const k of keys) {
      if (val === undefined || val === null) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Missing translation", lang, key);
        }
        const fallback = getNestedValue(en, key);
        const str = typeof fallback === "string" ? fallback : key;
        if (!params) return str;
        return str.replace(
          /\{(\w+)\}/g,
          (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`)
        );
      }
      val = (val as Record<string, unknown>)[k];
    }
    let str = (typeof val === "string" ? val : key) as string;
    if (params) {
      str = str.replace(
        /\{(\w+)\}/g,
        (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`)
      );
    }
    return str || key;
  };

  return t;
}
