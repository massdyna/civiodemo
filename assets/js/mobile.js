(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mq = window.matchMedia("(max-width:760px)");

  /* ---------- ปุ่ม "ดูเพิ่มเติม" ---------- */
  const reveal = (el) => {
    el.classList.remove("m-hidden");
    el.classList.add("m-just-shown", "is-visible", "is-seen");
  };
  function collapse(container, items, visible, opts = {}) {
    if (!container || items.length <= visible) return;
    const hidden = items.slice(visible);
    hidden.forEach((el) => el.classList.add("m-hidden"));
    const wrap = document.createElement("div");
    wrap.className = "m-more-wrap" + (opts.inline ? " is-inline" : "");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "m-more-btn";
    btn.setAttribute("aria-expanded", "false");
    const label = opts.more || "ดูเพิ่มเติม";
    const draw = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.innerHTML = open
        ? `<span>${opts.less || "ย่อลง"}</span><i></i>`
        : `<span>${label}</span>${opts.count === false ? "" : `<em>(${hidden.length})</em>`}<i></i>`;
    };
    draw(false);
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      if (open) {
        hidden.forEach((el, i) => { setTimeout(() => reveal(el), i * 70); });
      } else {
        hidden.forEach((el) => el.classList.remove("m-just-shown") || el.classList.add("m-hidden"));
        const top = container.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
      draw(open);
    });
    wrap.appendChild(btn);
    if (opts.inside) items[items.length - 1].after(wrap);
    else container.after(wrap);
  }

  const groups = [
    [".use-case-grid", ".use-case", 2],
    [".kn-grid", ".kn-card", 2],
    [".act-home .act-grid", ".act-card", 2],
    [".ad-related .act-grid", ".act-card", 2],
    [".value-benefit-grid", ".value-benefit-card", 2],
    [".detail-steps-grid", ".detail-step", 2],
    [".novabin-system-grid", ":scope > *", 2],
    [".cx-cards", ":scope > *", 2],
    [".faq-list", ":scope > *", 3, { count: true }],
    [".nx-gallery-grid", ":scope > *", 4]
  ];
  groups.forEach(([cSel, iSel, n, o]) => {
    $$(cSel).forEach((c) => {
      if (c.id === "actGrid") return;
      collapse(c, $$(iSel, c), n, o || {});
    });
  });

  $$(".model-table-wrap").forEach((w) => {
    collapse(w, $$(".model-table tbody tr", w), 3, { more: "ดูรุ่นอื่น ๆ", less: "ย่อรายการ" });
  });

  /* ข้อความยาว → "อ่านต่อ" */
  const about = $(".about-copy");
  if (about) {
    const ps = $$(":scope > p", about).filter((p) => !p.classList.contains("about-lead") && !p.classList.contains("about-kicker") && !p.classList.contains("about-en") && !p.classList.contains("about-note") && p.textContent.trim().length > 40);
    collapse(about, ps, 0, { inside: true, inline: true, more: "อ่านต่อ", less: "ย่อข้อความ", count: false });
  }
  const mani = $$(".manifesto-content .body-copy");
  if (mani.length) collapse(mani[0].parentNode, mani, 0, { inside: true, inline: true, more: "อ่านต่อ", less: "ย่อข้อความ", count: false });

  /* ---------- ตารางรุ่น → การ์ด (ใส่ป้ายกำกับให้แต่ละช่อง) ---------- */
  $$(".model-table").forEach((t) => {
    const heads = $$("thead th", t).map((th) => {
      const clone = th.cloneNode(true);
      $$("small", clone).forEach((s) => s.remove());
      return clone.textContent.trim();
    });
    $$("tbody tr", t).forEach((tr) => {
      const th = $("th", tr);
      const cells = $$("td", tr);
      if (th && cells[0]) th.setAttribute("data-cap", cells[0].textContent.trim());
      cells.forEach((td, i) => td.setAttribute("data-label", heads[i + 1] || ""));
    });
  });

  /* ---------- ส่วนท้ายเว็บพับได้ ---------- */
  $$(".ft2-col").forEach((col) => {
    const head = $(":scope > span", col);
    if (!head) return;
    const label = head.textContent.trim();
    const startOpen = !(label === "เมนู" || label === "ผลิตภัณฑ์");
    col.classList.add("m-acc");
    if (startOpen) col.classList.add("is-open");
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.setAttribute("aria-expanded", String(startOpen));
    const toggle = () => {
      const open = !col.classList.contains("is-open");
      col.classList.toggle("is-open", open);
      head.setAttribute("aria-expanded", String(open));
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });

  /* ---------- แถบติดต่อด้านล่าง ---------- */
  const onHome = !!$("#contact");
  const contactHref = onHome ? "#contact" : "index.html#contact";
  const ico = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  const bar = document.createElement("nav");
  bar.className = "m-bar";
  bar.setAttribute("aria-label", "ติดต่อด่วน");
  bar.innerHTML =
    `<a href="tel:0863517534">${ico.phone}<span>โทร</span></a>` +
    `<a class="m-bar-line" href="https://line.me/R/home/public/profile?id=civio" target="_blank" rel="noopener">${ico.chat}<span>LINE</span></a>` +
    `<a class="m-bar-main" href="${contactHref}">${ico.mail}<span>ปรึกษาทีมงาน</span></a>`;
  document.body.appendChild(bar);

  // ซ่อนแถบตอนเมนูเปิด หรือตอนอยู่ในส่วนติดต่อ/ท้ายหน้า (ไม่ให้ซ้ำซ้อน)
  const nav = $(".main-nav");
  if (nav && "MutationObserver" in window) {
    const sync = () => document.documentElement.classList.toggle("m-nav-open", nav.classList.contains("is-open"));
    new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ["class"] });
  }
  const away = $("#contact") || $(".detail-final-cta") || $(".ft2");
  if (away && "IntersectionObserver" in window) {
    const seen = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      bar.classList.toggle("is-away", seen.size > 0);
    }, { threshold: 0.12 });
    [$("#contact"), $(".detail-final-cta"), $(".ft2")].filter(Boolean).forEach((el) => io.observe(el));
  }
})();
