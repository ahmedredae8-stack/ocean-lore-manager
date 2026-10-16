import { FISH_ART } from "@/lib/art";
import { supabase } from "@/integrations/supabase/client";

export const FISH = [
  { id: "sardine", name: "سردين", img: FISH_ART.sardine, price: 12, weight: 50 },
  { id: "mackerel", name: "ماكريل", img: FISH_ART.mackerel, price: 34, weight: 25 },
  { id: "tuna", name: "تونة", img: FISH_ART.tuna, price: 92, weight: 12 },
  { id: "swordfish", name: "سمك السيف", img: FISH_ART.swordfish, price: 175, weight: 7 },
  { id: "turtle", name: "سلحفاة", img: FISH_ART.turtle, price: 214, weight: 4 },
  { id: "pearl", name: "محار اللؤلؤ", img: FISH_ART.pearl, price: 480, weight: 2 },
] as const;
export type FishId = (typeof FISH)[number]["id"];
export const CATCHES_UPDATED = "tos:catches";

/** Rolls a random haul of 1-3 species. */
export function rollHaul(): { id: FishId; qty: number }[] {
  const total = FISH.reduce((s, f) => s + f.weight, 0);
  const picks = new Map<FishId, number>();
  const kinds = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < kinds; i++) {
    let r = Math.random() * total;
    const f = FISH.find((x) => (r -= x.weight) < 0) ?? FISH[0];
    picks.set(f.id, (picks.get(f.id) ?? 0) + 1 + Math.floor(Math.random() * 6));
  }
  return [...picks].map(([id, qty]) => ({ id, qty }));
}

export async function saveHaul(haul: { id: FishId; qty: number }[]) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { error } = await supabase.from("catches").insert(haul.map((h) => ({ user_id: data.user!.id, fish_id: h.id, qty: h.qty })));
  if (!error) window.dispatchEvent(new Event(CATCHES_UPDATED));
  return !error;
}

export async function loadInventory() {
  const { data } = await supabase.from("catches").select("fish_id,qty");
  const totals: Record<string, number> = {};
  for (const r of data ?? []) totals[r.fish_id] = (totals[r.fish_id] ?? 0) + r.qty;
  return totals;
}

export async function sellFish(fishId: string) {
  const { error } = await supabase.from("catches").delete().eq("fish_id", fishId);
  if (!error) window.dispatchEvent(new Event(CATCHES_UPDATED));
  return !error;
}
