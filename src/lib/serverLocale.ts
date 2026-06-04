import { cookies } from "next/headers";
import type { Locale } from "@/data/i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("locale")?.value;
  return value === "en" ? "en" : "zh";
}
