// Boot and state: filters, search, sorting and hash routing for the finder.
// The page is static: every deal comes from data.js, nothing is fetched.

import { deals } from "./data.js";
import { filterDeals, sortDeals, totals, money } from "./deals.js";
import { listHTML, detailHTML } from "./views.js";

const $ = (id) => document.getElementById(id);
const view = $("view");
const state = { q: "", category: "", store: "", minDiscount: 0, verdict: "", sort: "discount" };

const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();

function renderStats() {
  const t = totals(deals);
  $("stats").innerHTML = `
    <div><dt>Deals checked</dt><dd>${t.count}</dd></div>
    <div><dt>Stores</dt><dd>${t.stores}</dd></div>
    <div><dt>Categories</dt><dd>${t.categories}</dd></div>
    <div><dt>Total savings</dt><dd>${money(Math.round(t.totalSavings))}</dd></div>
    <div><dt>Best discount</dt><dd>−${t.bestDiscount}%</dd></div>
    <div><dt>Last checked</dt><dd><small>${t.lastChecked ? t.lastChecked.slice(0, 16).replace("T", " ") + " UTC" : "—"}</small></dd></div>`;
}

function renderFilters() {
  $("cats").innerHTML =
    `<button class="chip" data-cat="" aria-pressed="${state.category === ""}">All</button>` +
    categories.map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${state.category === c}">${c}</button>`).join("");
  const storeSel = $("store");
  storeSel.innerHTML = `<option value="">All stores</option>` + stores.map((s) => `<option>${s}</option>`).join("");
  storeSel.value = state.store;
}

function render() {
  const hash = location.hash || "#/";
  const match = hash.match(/^#\/deal\/([\w-]+)$/);
  if (match) {
    const deal = deals.find((d) => d.id === match[1]);
    document.body.classList.add("detail-page");
    view.innerHTML = deal ? detailHTML(deal, deals) : `<p class="empty">That deal is not on this board.</p>`;
    $("count").textContent = "";
    window.scrollTo(0, 0);
    return;
  }
  document.body.classList.remove("detail-page");
  const shown = sortDeals(filterDeals(deals, state), state.sort);
  view.innerHTML = listHTML(shown, deals);
  $("count").textContent = `Showing ${shown.length} of ${deals.length} deals.`;
}

function bind() {
  $("q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("cats").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderFilters();
    render();
  });
  $("store").addEventListener("change", (e) => { state.store = e.target.value; render(); });
  $("mindisc").addEventListener("change", (e) => { state.minDiscount = Number(e.target.value); render(); });
  $("verdict").addEventListener("change", (e) => { state.verdict = e.target.value; render(); });
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("reset").addEventListener("click", () => {
    Object.assign(state, { q: "", category: "", store: "", minDiscount: 0, verdict: "", sort: "discount" });
    $("q").value = "";
    $("mindisc").value = "0";
    $("verdict").value = "";
    $("sort").value = "discount";
    renderFilters();
    render();
  });
  window.addEventListener("hashchange", render);
}

renderStats();
renderFilters();
bind();
render();
