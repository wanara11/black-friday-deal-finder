// Rendering: the deal list and the deal detail page. No data fetching here —
// the finder shows only the deals in data.js, and every link out is a plain <a>.

import { discountPct, savings, money, verdictOf, VERDICTS, crossStore } from "./deals.js";

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function verdictBadge(deal) {
  const v = verdictOf(deal);
  return `<span class="verdict ${v}">${esc(VERDICTS[v].label)}</span>`;
}

function checkedLine(deal) {
  const when = new Date(deal.checked);
  const text = Number.isNaN(when.getTime())
    ? esc(deal.checked)
    : when.toISOString().slice(0, 16).replace("T", " ") + " UTC";
  return `Checked <code>${text}</code> · Source: ${esc(deal.source)}`;
}

export function cardHTML(deal, all) {
  const pct = discountPct(deal);
  const others = crossStore(deal, all);
  const also = others.length
    ? `<p class="also">Also at ${others.map((o) => `<b>${esc(o.store)}</b> for <b>${money(o.price)}</b>`).join(" · ")}</p>`
    : "";
  return `<article class="card">
    <h3><a href="#/deal/${esc(deal.id)}">${esc(deal.title)}</a></h3>
    <p class="meta"><span><b>${esc(deal.store)}</b></span><span>${esc(deal.category)}</span></p>
    <p class="price-row">
      <span class="price">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="off">−${pct}%</span>
      <span class="save">Save ${money(savings(deal))}</span>
    </p>
    <p>${verdictBadge(deal)}</p>
    ${also}
    <p class="checked">${checkedLine(deal)}</p>
    <a class="cta" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a>
  </article>`;
}

export function listHTML(list, all) {
  if (!list.length) {
    return `<p class="empty">No deals match those filters. Loosen the discount or clear the search.</p>`;
  }
  return `<div class="grid">${list.map((d) => cardHTML(d, all)).join("")}</div>`;
}

export function detailHTML(deal, all) {
  const pct = discountPct(deal);
  const others = crossStore(deal, all);
  const compare = others.length
    ? `<tr><th>Same product elsewhere</th><td>${others.map((o) => `${esc(o.store)} — <b>${money(o.price)}</b> (${money(o.was)} list, −${discountPct(o)}%)`).join("<br>")}</td></tr>`
    : "";
  return `<article class="detail">
    <p><a class="back" href="#/">← All deals</a></p>
    <h2>${esc(deal.title)}</h2>
    <p class="meta"><span><b>${esc(deal.store)}</b></span><span>${esc(deal.category)}</span></p>
    <p class="price-row">
      <span class="price">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="off">−${pct}%</span>
      <span class="save">Save ${money(savings(deal))}</span>
    </p>
    <p>${verdictBadge(deal)}</p>
    <table class="facts">
      <tr><th>Sale price</th><td><b>${money(deal.price)}</b></td></tr>
      <tr><th>Usual price</th><td>${money(deal.was)}</td></tr>
      <tr><th>Discount</th><td>${pct}% — you save ${money(savings(deal))}</td></tr>
      <tr><th>Store</th><td>${esc(deal.store)}</td></tr>
      <tr><th>Checked</th><td>${checkedLine(deal)}</td></tr>
      ${compare}
    </table>
    <p class="evidence"><b>Why this verdict:</b> ${esc(deal.note || "Price read at the store on the check time; discount matches the two prices.")}</p>
    <p><a class="cta" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a></p>
  </article>`;
}
