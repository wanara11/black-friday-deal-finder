// Deal math: discount, savings, the "sniff test" verdict and ranking. One job each.
// A verdict is assigned per deal in data.js (with its evidence note) and only
// sanity-checked here: the discount shown must match the two prices.

export const VERDICTS = {
  real: { label: "Real deal", rank: 0 },
  strong: { label: "Strong", rank: 1 },
  routine: { label: "Routine", rank: 2 },
  inflated: { label: "Inflated", rank: 3 },
};

export function discountPct(deal) {
  if (!deal.was || deal.was <= 0) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savings(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] ? deal.verdict : "routine";
}

// Deals the site lists, in the order the finder shows them by default:
// best verdict first, then biggest discount, then biggest savings.
export function sortDeals(list, sort) {
  const copy = [...list];
  if (sort === "savings") return copy.sort((a, b) => savings(b) - savings(a) || discountPct(b) - discountPct(a));
  if (sort === "price") return copy.sort((a, b) => a.price - b.price || discountPct(b) - discountPct(a));
  if (sort === "verdict") {
    return copy.sort((a, b) => VERDICTS[verdictOf(a)].rank - VERDICTS[verdictOf(b)].rank || discountPct(b) - discountPct(a));
  }
  return copy.sort((a, b) => discountPct(b) - discountPct(a) || savings(b) - savings(a));
}

export function filterDeals(list, { q, category, store, minDiscount, verdict }) {
  const needle = (q || "").trim().toLowerCase();
  return list.filter((d) => {
    if (category && d.category !== category) return false;
    if (store && d.store !== store) return false;
    if (minDiscount && discountPct(d) < minDiscount) return false;
    if (verdict && verdictOf(d) !== verdict) return false;
    if (needle) {
      const hay = `${d.title} ${d.store} ${d.category}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

// Same product at another store: match on a shared `group` id when present.
export function crossStore(deal, list) {
  if (!deal.group) return [];
  return list.filter((d) => d.group === deal.group && d.id !== deal.id);
}

export function totals(list) {
  const best = list.reduce((m, d) => (discountPct(d) > discountPct(m) ? d : m), list[0]);
  return {
    count: list.length,
    stores: new Set(list.map((d) => d.store)).size,
    categories: new Set(list.map((d) => d.category)).size,
    totalSavings: list.reduce((s, d) => s + savings(d), 0),
    bestDiscount: best ? discountPct(best) : 0,
    lastChecked: list.map((d) => d.checked).sort().at(-1) || "",
  };
}
