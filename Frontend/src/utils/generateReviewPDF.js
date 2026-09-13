import { jsPDF } from "jspdf";

// ─── Design tokens (light / print-friendly theme) ────────────────────────────

const C = {
  // page
  white:        [255, 255, 255],
  pageBg:       [250, 251, 253],   // near-white page

  // header / footer
  headerBg:     [30,  32,  48],    // deep navy
  headerText:   [255, 255, 255],
  headerSub:    [180, 185, 210],
  footerBg:     [245, 246, 249],
  footerBorder: [220, 222, 230],
  footerText:   [140, 145, 160],

  // section headings
  accentBar:    [99,  102, 241],   // indigo
  headingText:  [25,  27,  40],
  subHeading:   [60,  65,  90],
  sectionLine:  [220, 222, 232],

  // body text
  bodyText:     [45,  48,  65],    // near-black
  mutedText:    [100, 105, 125],

  // code block
  codeBg:       [245, 246, 250],
  codeBorder:   [210, 213, 225],
  codeText:     [35,  38,  55],
  lineNumBg:    [237, 239, 246],
  lineNumText:  [160, 165, 185],

  // inline fence (AI review code snippets)
  fenceBg:      [240, 242, 248],
  fenceBorder:  [205, 208, 222],
  fenceText:    [40,  45,  70],

  // accents for ❌ / ✅ / 💡
  red:          [200, 50,  50],
  green:        [22,  140, 90],
  indigo:       [80,  90,  200],

  // pill / badge
  badgeBg:      [232, 234, 255],
  badgeText:    [80,  85,  200],

  // bullet
  bullet:       [99,  102, 241],
};

const FONT = { sans: "helvetica", mono: "courier" };

const PAGE = {
  w:  210, h:  297,
  ml: 18,  mr: 18,
  headerH: 50,
  footerH: 14,
};
PAGE.contentW      = PAGE.w  - PAGE.ml - PAGE.mr;
PAGE.contentTop    = PAGE.headerH + 8;
PAGE.contentBottom = PAGE.h - PAGE.footerH - 10;

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const setFill  = (doc, rgb) => doc.setFillColor(...rgb);
const setDraw  = (doc, rgb) => doc.setDrawColor(...rgb);
const setColor = (doc, rgb) => doc.setTextColor(...rgb);

// ─── Header ───────────────────────────────────────────────────────────────────

function drawHeader(doc, dateStr) {
  const { w, headerH } = PAGE;

  // navy background
  setFill(doc, C.headerBg);
  doc.rect(0, 0, w, headerH, "F");

  // left accent stripe
  setFill(doc, C.accentBar);
  doc.rect(0, 0, 5, headerH, "F");

  // brand icon box
  setFill(doc, C.accentBar);
  doc.roundedRect(13, 11, 18, 18, 3, 3, "F");
  setColor(doc, C.white);
  doc.setFont(FONT.mono, "bold");
  doc.setFontSize(8);
  doc.text("</>", 22, 22, { align: "center" });

  // project name
  setColor(doc, C.headerText);
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(13);
  doc.text("CodeScope", 37, 21);

  // subtitle
  setColor(doc, C.headerSub);
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(8);
  doc.text("AI Code Reviewer", 37, 27);

  // right — report title
  setColor(doc, [180, 185, 255]);
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(11);
  doc.text("Code Review Report", w - PAGE.mr, 21, { align: "right" });

  // right — date
  setColor(doc, C.headerSub);
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7.5);
  doc.text(dateStr, w - PAGE.mr, 28, { align: "right" });

  // bottom separator line (lighter)
  setDraw(doc, [55, 58, 80]);
  doc.setLineWidth(0.4);
  doc.line(0, headerH, w, headerH);
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function drawFooter(doc, pageNum, totalPages) {
  const { w, h, footerH } = PAGE;
  const y = h - footerH;

  setFill(doc, C.footerBg);
  doc.rect(0, y, w, footerH, "F");

  setDraw(doc, C.footerBorder);
  doc.setLineWidth(0.25);
  doc.line(0, y, w, y);

  setColor(doc, C.footerText);
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7);
  doc.text(
    "CodeScope AI  ·  AI-generated reviews may contain mistakes.",
    PAGE.ml, y + 8
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, w - PAGE.mr, y + 8, { align: "right" });
}

// ─── Cursor helpers ───────────────────────────────────────────────────────────

function newPage(state) {
  state.doc.addPage();
  state.page++;

  // white page background
  setFill(state.doc, C.white);
  state.doc.rect(0, 0, PAGE.w, PAGE.h, "F");

  drawHeader(state.doc, state.dateStr);
  state.y = PAGE.contentTop;
}

/** Move cursor down by dy; start a new page if we'd overflow. */
function advance(state, dy) {
  state.y += dy;
  if (state.y > PAGE.contentBottom) {
    newPage(state);
  }
}

// ─── Text renderer ────────────────────────────────────────────────────────────

function renderText(state, text, opts = {}) {
  const {
    font    = FONT.sans,
    style   = "normal",
    size    = 10,
    color   = C.bodyText,
    maxWidth = PAGE.contentW,
    lineH   = size * 0.42,
    x       = PAGE.ml,
    indent  = 0,
  } = opts;

  const doc = state.doc;
  doc.setFont(font, style);
  doc.setFontSize(size);
  setColor(doc, color);

  const lines   = doc.splitTextToSize(text, maxWidth - indent);
  const leading = size / 2.835 + lineH;

  for (const line of lines) {
    advance(state, leading);
    doc.text(line, x + indent, state.y);
  }
}

// ─── Section heading ──────────────────────────────────────────────────────────

function renderSectionHeading(state, title) {
  advance(state, 10);

  const doc = state.doc;
  const y   = state.y;

  // left accent bar
  setFill(doc, C.accentBar);
  doc.rect(PAGE.ml, y - 6, 3.5, 9, "F");

  // title
  setColor(doc, C.headingText);
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(13);
  doc.text(title, PAGE.ml + 8, y);

  // underline
  advance(state, 4);
  setDraw(doc, C.sectionLine);
  doc.setLineWidth(0.35);
  doc.line(PAGE.ml, state.y, PAGE.w - PAGE.mr, state.y);

  advance(state, 5);
}

// ─── Submitted code block ─────────────────────────────────────────────────────

function renderCodeBlock(state, code, language) {
  const doc    = state.doc;
  const padX   = 5;
  const padY   = 5;
  const lineH  = 4.4;   // mm per rendered line
  const size   = 8;
  const lineNumW = 11;

  // language badge
  advance(state, 3);
  const badgeW = language.length * 1.8 + 10;
  setFill(doc, C.badgeBg);
  setDraw(doc, C.accentBar);
  doc.setLineWidth(0.2);
  doc.roundedRect(PAGE.ml, state.y - 3.5, badgeW, 5.5, 1.5, 1.5, "FD");
  setColor(doc, C.badgeText);
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(7);
  doc.text(language.toUpperCase(), PAGE.ml + badgeW / 2, state.y, { align: "center" });

  advance(state, 6);

  // wrap all lines
  doc.setFont(FONT.mono, "normal");
  doc.setFontSize(size);
  const maxW = PAGE.contentW - lineNumW - padX * 2;
  const rawLines = code.split("\n");
  const allLines = [];
  for (const r of rawLines) {
    const wrapped = doc.splitTextToSize(r === "" ? " " : r, maxW);
    allLines.push(...wrapped);
  }

  let idx = 0;
  while (idx < allLines.length) {
    const available  = PAGE.contentBottom - state.y - padY * 2;
    const perChunk   = Math.max(1, Math.floor(available / lineH));
    const chunk      = allLines.slice(idx, idx + perChunk);
    const chunkStart = idx;
    idx += chunk.length;

    const blockH = chunk.length * lineH + padY * 2;

    // outer box
    setFill(doc, C.codeBg);
    setDraw(doc, C.codeBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(PAGE.ml, state.y, PAGE.contentW, blockH, 2.5, 2.5, "FD");

    // line-number gutter
    setFill(doc, C.lineNumBg);
    doc.rect(PAGE.ml, state.y, lineNumW, blockH, "F");
    // re-draw border on top of gutter fill
    setDraw(doc, C.codeBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(PAGE.ml, state.y, PAGE.contentW, blockH, 2.5, 2.5, "D");

    // gutter / content separator
    setDraw(doc, C.codeBorder);
    doc.setLineWidth(0.2);
    doc.line(
      PAGE.ml + lineNumW, state.y,
      PAGE.ml + lineNumW, state.y + blockH
    );

    // render lines
    let ly = state.y + padY;
    for (let i = 0; i < chunk.length; i++) {
      const lineNum = chunkStart + i + 1;

      setColor(doc, C.lineNumText);
      doc.setFont(FONT.mono, "normal");
      doc.setFontSize(7);
      doc.text(String(lineNum), PAGE.ml + lineNumW - 2, ly, { align: "right" });

      setColor(doc, C.codeText);
      doc.setFontSize(size);
      doc.text(chunk[i], PAGE.ml + lineNumW + padX, ly);

      ly += lineH;
    }

    state.y += blockH;

    if (idx < allLines.length) newPage(state);
  }

  advance(state, 6);
}

// ─── Markdown parser ──────────────────────────────────────────────────────────

function parseMarkdown(md) {
  const tokens = [];
  const lines  = md.split("\n");
  let inFence  = false, fenceLines = [], fenceLang = "";

  for (const raw of lines) {
    if (raw.trimStart().startsWith("```")) {
      if (!inFence) {
        inFence = true;
        fenceLang = raw.trim().replace(/^```/, "").trim();
        fenceLines = [];
      } else {
        tokens.push({ type: "fence", lang: fenceLang, content: fenceLines.join("\n") });
        inFence = false; fenceLines = []; fenceLang = "";
      }
      continue;
    }
    if (inFence) { fenceLines.push(raw); continue; }

    const h1 = raw.match(/^# (.+)/);
    const h2 = raw.match(/^## (.+)/);
    const h3 = raw.match(/^### (.+)/);
    if (h1) { tokens.push({ type: "h1", content: h1[1] }); continue; }
    if (h2) { tokens.push({ type: "h2", content: h2[1] }); continue; }
    if (h3) { tokens.push({ type: "h3", content: h3[1] }); continue; }

    if (/^-{3,}$/.test(raw.trim())) { tokens.push({ type: "hr" }); continue; }

    const ul = raw.match(/^(\s*)[-*+] (.+)/);
    if (ul) {
      tokens.push({ type: "li", content: ul[2], indent: Math.floor(ul[1].length / 2) });
      continue;
    }

    const ol = raw.match(/^(\s*)(\d+)\. (.+)/);
    if (ol) {
      tokens.push({ type: "oli", num: ol[2], content: ol[3], indent: Math.floor(ol[1].length / 2) });
      continue;
    }

    if (raw.trim() === "") { tokens.push({ type: "br" }); continue; }

    tokens.push({ type: "p", content: raw });
  }

  if (inFence && fenceLines.length) {
    tokens.push({ type: "fence", lang: fenceLang, content: fenceLines.join("\n") });
  }

  return tokens;
}

function stripInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g,    "$1")
    .replace(/__(.+?)__/g,    "$1")
    .replace(/_(.+?)_/g,      "$1")
    .replace(/`(.+?)`/g,      "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

function accentColor(text) {
  if (/^❌|^✗/.test(text))        return C.red;
  if (/^✅|^✔/.test(text))        return C.green;
  if (/^💡|^🔍|^⚠/.test(text))   return C.indigo;
  return null;
}

// ─── Inline fence (AI review code snippet) ────────────────────────────────────

function renderInlineFence(state, content, lang) {
  const doc   = state.doc;
  const padX  = 4, padY = 3.5;
  const lineH = 4.2, size = 7.5;

  advance(state, 3);

  if (lang) {
    setColor(doc, C.mutedText);
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.text(lang, PAGE.ml, state.y);
    advance(state, 3.5);
  }

  doc.setFont(FONT.mono, "normal");
  doc.setFontSize(size);
  const maxW = PAGE.contentW - padX * 2;
  const rawLines = content.split("\n");
  const allLines = [];
  for (const r of rawLines) {
    allLines.push(...doc.splitTextToSize(r === "" ? " " : r, maxW));
  }

  let idx = 0;
  while (idx < allLines.length) {
    const avail   = PAGE.contentBottom - state.y - padY * 2;
    const perPage = Math.max(1, Math.floor(avail / lineH));
    const chunk   = allLines.slice(idx, idx + perPage);
    idx += chunk.length;

    const blockH = chunk.length * lineH + padY * 2;

    setFill(doc, C.fenceBg);
    setDraw(doc, C.fenceBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(PAGE.ml, state.y, PAGE.contentW, blockH, 2, 2, "FD");

    let ly = state.y + padY;
    for (const line of chunk) {
      setColor(doc, C.fenceText);
      doc.text(line, PAGE.ml + padX, ly);
      ly += lineH;
    }

    state.y += blockH;
    if (idx < allLines.length) newPage(state);
  }

  advance(state, 4);
}

// ─── Markdown token renderer ──────────────────────────────────────────────────

function renderTokens(state, tokens) {
  for (const tok of tokens) {
    switch (tok.type) {

      case "h1":
        advance(state, 8);
        renderText(state, stripInline(tok.content), {
          style: "bold", size: 15, color: C.headingText, lineH: 1,
        });
        advance(state, 2);
        setDraw(state.doc, C.sectionLine);
        state.doc.setLineWidth(0.3);
        state.doc.line(PAGE.ml, state.y, PAGE.w - PAGE.mr, state.y);
        advance(state, 3);
        break;

      case "h2":
        advance(state, 7);
        renderText(state, stripInline(tok.content), {
          style: "bold", size: 12, color: C.subHeading, lineH: 1,
        });
        advance(state, 1);
        setDraw(state.doc, C.sectionLine);
        state.doc.setLineWidth(0.2);
        state.doc.line(PAGE.ml, state.y, PAGE.ml + 70, state.y);
        advance(state, 3);
        break;

      case "h3":
        advance(state, 5);
        renderText(state, stripInline(tok.content), {
          style: "bold", size: 10.5, color: C.accentBar, lineH: 0.8,
        });
        advance(state, 2);
        break;

      case "hr":
        advance(state, 5);
        setDraw(state.doc, C.sectionLine);
        state.doc.setLineWidth(0.25);
        state.doc.line(PAGE.ml, state.y, PAGE.w - PAGE.mr, state.y);
        advance(state, 5);
        break;

      case "br":
        advance(state, 3);
        break;

      case "li": {
        const ix = Math.min(tok.indent * 5, 15);
        setFill(state.doc, C.bullet);
        state.doc.circle(PAGE.ml + ix + 2.5, state.y + 4, 0.9, "F");
        renderText(state, stripInline(tok.content), {
          size: 9.5, color: accentColor(tok.content) || C.bodyText,
          indent: ix + 6, lineH: 0.6,
        });
        break;
      }

      case "oli": {
        const ix = Math.min(tok.indent * 5, 15);
        // peek-ahead: advance temporarily to get correct y, then print number
        const savedY = state.y;
        advance(state, 4.5);
        setColor(state.doc, C.accentBar);
        state.doc.setFont(FONT.sans, "bold");
        state.doc.setFontSize(9);
        state.doc.text(`${tok.num}.`, PAGE.ml + ix, state.y);
        state.y = savedY;
        renderText(state, stripInline(tok.content), {
          size: 9.5, color: C.bodyText, indent: ix + 8, lineH: 0.6,
        });
        break;
      }

      case "fence":
        renderInlineFence(state, tok.content, tok.lang);
        break;

      case "p": {
        const color = accentColor(tok.content) || C.bodyText;
        renderText(state, stripInline(tok.content), {
          size: 9.5, color, lineH: 0.8,
        });
        break;
      }

      default: break;
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates and auto-downloads a professional PDF code-review report.
 *
 * @param {{ code: string, language?: string, review: string, date?: Date }} opts
 */
export function generateReviewPDF({ code, language = "JavaScript", review, date }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const reviewDate = date instanceof Date ? date : new Date();
  const dateStr = reviewDate.toLocaleString("en-US", {
    weekday: "short", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  // ── Page 1 setup ────────────────────────────────────────────────────────────
  // White background first, then header on top
  setFill(doc, C.white);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");
  drawHeader(doc, dateStr);

  const state = {
    doc, dateStr,
    page: 1,
    y: PAGE.contentTop,
  };

  // ── Section 1: Submitted Code ───────────────────────────────────────────────
  renderSectionHeading(state, "Submitted Code");

  // meta row
  advance(state, 2);
  setColor(doc, C.mutedText);
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(8.5);
  doc.text(`Language: ${language}`, PAGE.ml, state.y);
  advance(state, 5);

  renderCodeBlock(state, code, language);

  // ── Section 2: AI Review ────────────────────────────────────────────────────
  renderSectionHeading(state, "AI Code Review");

  renderTokens(state, parseMarkdown(review));

  // ── Back-fill footers on every page ────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total);
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  const safeLang  = language.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const timestamp = reviewDate.toISOString().slice(0, 10);
  doc.save(`code-review-${safeLang}-${timestamp}.pdf`);
}
