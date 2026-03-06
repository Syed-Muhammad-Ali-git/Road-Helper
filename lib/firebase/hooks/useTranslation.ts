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

export function useTranslation() {
  const { lang } = useLangStore();

  const t = (key: NestedPaths<Dictionary>) => {
    const keys = key.split(".");
    let val: any = (dictionaries as any)[lang];
    for (const k of keys) {
      if (val === undefined) return key;
      val = val[k];
    }
    return (val as unknown as string) || key;
  };

  return t;
}
