import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const OUT = path.resolve("output/BuildFlow_AI_Final_Presentation.pptx");
const PREVIEW_DIR = path.resolve("scratch/final_presentation_previews");
const QA_JSON = path.resolve("scratch/final_presentation_qa.json");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });
pptx.author = "Codex";
pptx.company = "Rajiv Gandhi College of Engineering and Technology";
pptx.subject = "BuildFlow AI final-year mini project presentation";
pptx.title = "BuildFlow AI - AI-Based Project Planning Assistant";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Bahnschrift",
  bodyFontFace: "Calibri",
  lang: "en-US",
};

const W = 13.333;
const H = 7.5;
const ST = pptx.ShapeType;

const C = {
  blue: "2563EB",
  indigo: "4F46E5",
  cyan: "06B6D4",
  white: "FFFFFF",
  light: "F8FAFC",
  panel: "FFFFFF",
  panelBlue: "EFF6FF",
  panelCyan: "ECFEFF",
  line: "D9E7F7",
  slate: "64748B",
  dark: "0F172A",
  softText: "475569",
  mint: "14B8A6",
  amber: "F59E0B",
  rose: "F43F5E",
};

function addBackground(slide, accent = "right") {
  slide.background = { color: C.white };
  slide.addShape(ST.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: C.white },
    line: { color: C.white, transparency: 100 },
  });
  slide.addShape(ST.arc, {
    x: accent === "left" ? -1.2 : 9.55,
    y: accent === "left" ? -1.0 : -0.75,
    w: 4.2,
    h: 4.2,
    rotate: accent === "left" ? 22 : 198,
    fill: { color: "DBEAFE", transparency: 26 },
    line: { color: "DBEAFE", transparency: 100 },
  });
  slide.addShape(ST.arc, {
    x: accent === "left" ? 9.4 : 8.9,
    y: 4.55,
    w: 3.9,
    h: 3.9,
    rotate: 208,
    fill: { color: "CFFAFE", transparency: 35 },
    line: { color: "CFFAFE", transparency: 100 },
  });
  for (let x = 0.45; x < W; x += 0.82) {
    slide.addShape(ST.line, {
      x,
      y: 0,
      w: 0,
      h: H,
      line: { color: "CBD5E1", transparency: 92, width: 0.32 },
    });
  }
  for (let y = 0.38; y < H; y += 0.82) {
    slide.addShape(ST.line, {
      x: 0,
      y,
      w: W,
      h: 0,
      line: { color: "CBD5E1", transparency: 92, width: 0.32 },
    });
  }
}

function addBrand(slide) {
  slide.addText("BuildFlow AI", {
    x: 11.38,
    y: 0.44,
    w: 1.2,
    h: 0.15,
    margin: 0,
    align: "right",
    fontFace: "Calibri",
    bold: true,
    fontSize: 8.8,
    color: C.blue,
  });
}

function addFooter(slide, n) {
  slide.addShape(ST.line, {
    x: 0.66,
    y: 7.08,
    w: 11.92,
    h: 0,
    line: { color: C.line, width: 0.55 },
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.4,
    y: 7.0,
    w: 0.28,
    h: 0.12,
    margin: 0,
    align: "right",
    fontFace: "Calibri",
    bold: true,
    fontSize: 7.6,
    color: C.slate,
  });
}

function addTitle(slide, n, title, subtitle) {
  slide.addShape(ST.roundRect, {
    x: 0.66,
    y: 0.48,
    w: 0.56,
    h: 0.26,
    rectRadius: 0.08,
    fill: { color: C.panelBlue },
    line: { color: C.panelBlue, transparency: 100 },
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 0.66,
    y: 0.57,
    w: 0.56,
    h: 0.08,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 7.4,
    color: C.blue,
  });
  slide.addText(title, {
    x: 0.66,
    y: 0.92,
    w: 7.95,
    h: 0.42,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 24,
    color: C.dark,
    fit: "shrink",
  });
  slide.addShape(ST.line, {
    x: 0.68,
    y: 1.48,
    w: 1.08,
    h: 0,
    line: { color: C.cyan, width: 2.7 },
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.66,
      y: 1.62,
      w: 8.25,
      h: 0.2,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 11,
      color: C.slate,
      fit: "shrink",
    });
  }
  addBrand(slide);
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(ST.roundRect, {
    x: x + 0.05,
    y: y + 0.07,
    w,
    h,
    rectRadius: opts.r ?? 0.08,
    fill: { color: "0F172A", transparency: opts.shadowT ?? 90 },
    line: { color: "0F172A", transparency: 100 },
  });
  slide.addShape(ST.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.r ?? 0.08,
    fill: { color: opts.fill || C.panel, transparency: opts.transparency ?? 0 },
    line: { color: opts.line || C.line, transparency: opts.lineT ?? 0, width: opts.lineW ?? 1 },
    shadow: opts.shadow ?? {
      type: "outer",
      color: "1E293B",
      opacity: 0.12,
      blur: 2.2,
      angle: 45,
      distance: 1.1,
    },
  });
}

function glassCard(slide, x, y, w, h) {
  slide.addShape(ST.roundRect, {
    x: x + 0.05,
    y: y + 0.07,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: "0F172A", transparency: 93 },
    line: { color: "0F172A", transparency: 100 },
  });
  slide.addShape(ST.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: "FFFFFF", transparency: 16 },
    line: { color: "BFDBFE", transparency: 18, width: 1 },
    shadow: {
      type: "outer",
      color: "1E293B",
      opacity: 0.08,
      blur: 2.3,
      angle: 45,
      distance: 1.2,
    },
  });
}

function pill(slide, text, x, y, w, fill = C.panelBlue, color = C.blue) {
  slide.addShape(ST.roundRect, {
    x,
    y,
    w,
    h: 0.3,
    rectRadius: 0.1,
    fill: { color: fill },
    line: { color: fill, transparency: 100 },
  });
  slide.addText(text, {
    x,
    y: y + 0.08,
    w,
    h: 0.1,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 7.2,
    color,
    fit: "shrink",
  });
}

function icon(slide, kind, x, y, s = 0.46, color = C.blue, bg = C.panelBlue) {
  slide.addShape(ST.ellipse, {
    x,
    y,
    w: s,
    h: s,
    fill: { color: bg },
    line: { color, transparency: 70 },
  });
  const cx = x + s / 2;
  const cy = y + s / 2;
  const lw = 1.2;
  if (kind === "spark") {
    slide.addShape(ST.line, { x: cx, y: y + 0.09, w: 0, h: s - 0.18, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + 0.09, y: cy, w: s - 0.18, h: 0, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + 0.14, y: y + 0.14, w: s - 0.28, h: s - 0.28, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s - 0.14, y: y + 0.14, w: -(s - 0.28), h: s - 0.28, line: { color, width: lw } });
  } else if (kind === "doc") {
    slide.addShape(ST.roundRect, {
      x: x + s * 0.29,
      y: y + s * 0.18,
      w: s * 0.42,
      h: s * 0.56,
      rectRadius: 0.02,
      fill: { color: C.white, transparency: 8 },
      line: { color, width: lw },
    });
    slide.addShape(ST.line, { x: x + s * 0.36, y: y + s * 0.36, w: s * 0.24, h: 0, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s * 0.36, y: y + s * 0.49, w: s * 0.19, h: 0, line: { color, width: lw } });
  } else if (kind === "db") {
    slide.addShape(ST.can, {
      x: x + s * 0.24,
      y: y + s * 0.2,
      w: s * 0.52,
      h: s * 0.58,
      fill: { color: C.white, transparency: 8 },
      line: { color, width: lw },
    });
  } else if (kind === "shield") {
    slide.addShape(ST.homePlate, {
      x: x + s * 0.26,
      y: y + s * 0.2,
      w: s * 0.48,
      h: s * 0.52,
      rotate: 90,
      fill: { color: C.white, transparency: 100 },
      line: { color, width: lw },
    });
  } else if (kind === "gear") {
    slide.addShape(ST.ellipse, {
      x: x + s * 0.31,
      y: y + s * 0.31,
      w: s * 0.38,
      h: s * 0.38,
      fill: { color: C.white, transparency: 100 },
      line: { color, width: lw },
    });
    for (const a of [0, 45, 90, 135]) {
      const len = s * 0.18;
      slide.addShape(ST.line, {
        x: cx - len / 2,
        y: cy,
        w: len,
        h: 0,
        rotate: a,
        line: { color, width: lw },
      });
    }
  } else if (kind === "flow") {
    slide.addShape(ST.line, { x: x + s * 0.2, y: cy, w: s * 0.23, h: 0, line: { color, width: lw } });
    slide.addShape(ST.line, { x: cx, y: cy, w: s * 0.18, h: -s * 0.16, line: { color, width: lw } });
    slide.addShape(ST.line, { x: cx, y: cy, w: s * 0.18, h: s * 0.16, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s * 0.6, y: y + s * 0.15, w: 0, h: s * 0.18, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s * 0.6, y: y + s * 0.52, w: 0, h: s * 0.14, line: { color, width: lw } });
  } else if (kind === "chat") {
    slide.addShape(ST.roundRect, {
      x: x + s * 0.22,
      y: y + s * 0.22,
      w: s * 0.56,
      h: s * 0.4,
      rectRadius: 0.04,
      fill: { color: C.white, transparency: 10 },
      line: { color, width: lw },
    });
    slide.addShape(ST.chevron, {
      x: x + s * 0.36,
      y: y + s * 0.52,
      w: s * 0.12,
      h: s * 0.08,
      rotate: 225,
      fill: { color: C.white },
      line: { color, transparency: 100 },
    });
  } else {
    slide.addText(kind.slice(0, 2).toUpperCase(), {
      x,
      y: y + s * 0.31,
      w: s,
      h: s * 0.12,
      margin: 0,
      align: "center",
      fontFace: "Calibri",
      bold: true,
      fontSize: 7.2,
      color,
    });
  }
}

function bulletList(slide, items, x, y, w, opts = {}) {
  const size = opts.size ?? 13.3;
  const gap = opts.gap ?? 0.5;
  items.slice(0, 5).forEach((item, i) => {
    const yy = y + i * gap;
    slide.addShape(ST.ellipse, {
      x,
      y: yy + 0.1,
      w: 0.11,
      h: 0.11,
      fill: { color: opts.dot || C.cyan },
      line: { color: opts.dot || C.cyan, transparency: 100 },
    });
    slide.addText(item, {
      x: x + 0.22,
      y: yy,
      w,
      h: 0.21,
      margin: 0,
      fontFace: "Calibri",
      fontSize: size,
      bold: opts.bold ?? false,
      color: opts.color || C.dark,
      fit: "shrink",
    });
  });
}

function placeholder(slide, x, y, w, h, titleText, caption) {
  slide.addShape(ST.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: "F8FBFF", transparency: 0 },
    line: { color: "93C5FD", width: 1.2, dash: "dash" },
  });
  slide.addShape(ST.line, {
    x: x + 0.2,
    y: y + 0.2,
    w: w - 0.4,
    h: h - 0.4,
    line: { color: "BFDBFE", width: 0.75, transparency: 10, dash: "dash" },
  });
  slide.addShape(ST.line, {
    x: x + w - 0.2,
    y: y + 0.2,
    w: -(w - 0.4),
    h: h - 0.4,
    line: { color: "BFDBFE", width: 0.75, transparency: 10, dash: "dash" },
  });
  slide.addText(titleText, {
    x: x + 0.2,
    y: y + h / 2 - 0.28,
    w: w - 0.4,
    h: 0.22,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 13.5,
    color: C.blue,
    fit: "shrink",
  });
  slide.addText(caption, {
    x: x + 0.2,
    y: y + h / 2 + 0.08,
    w: w - 0.4,
    h: 0.15,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    fontSize: 8.8,
    color: C.slate,
    fit: "shrink",
  });
}

function statCard(slide, x, y, w, h, labelText, bodyText, color = C.blue) {
  card(slide, x, y, w, h, { fill: C.panel });
  slide.addShape(ST.rect, {
    x,
    y,
    w: 0.12,
    h,
    fill: { color },
    line: { color, transparency: 100 },
  });
  slide.addText(labelText, {
    x: x + 0.28,
    y: y + 0.24,
    w: w - 0.46,
    h: 0.17,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 11.6,
    color: C.dark,
    fit: "shrink",
  });
  slide.addText(bodyText, {
    x: x + 0.28,
    y: y + 0.56,
    w: w - 0.46,
    h: 0.36,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.9,
    color: C.slate,
    fit: "shrink",
  });
}

function addCover() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  s.addShape(ST.rect, {
    x: 8.4,
    y: 0,
    w: 4.95,
    h: H,
    fill: { color: "EEF4FF", transparency: 0 },
    line: { color: "EEF4FF", transparency: 100 },
  });
  s.addShape(ST.arc, {
    x: 8.65,
    y: 0.42,
    w: 3.8,
    h: 3.8,
    rotate: 8,
    fill: { color: "DBEAFE", transparency: 6 },
    line: { color: "DBEAFE", transparency: 100 },
  });
  s.addShape(ST.arc, {
    x: 9.15,
    y: 3.98,
    w: 4.3,
    h: 4.3,
    rotate: 210,
    fill: { color: "CFFAFE", transparency: 10 },
    line: { color: "CFFAFE", transparency: 100 },
  });
  s.addText("BuildFlow AI", {
    x: 0.84,
    y: 1.02,
    w: 5.6,
    h: 0.7,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 35,
    color: C.dark,
    fit: "shrink",
  });
  s.addText("AI-Based Project Planning Assistant", {
    x: 0.88,
    y: 1.88,
    w: 4.95,
    h: 0.28,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 18,
    color: C.slate,
    fit: "shrink",
  });
  s.addShape(ST.line, {
    x: 0.9,
    y: 2.43,
    w: 1.32,
    h: 0,
    line: { color: C.cyan, width: 3 },
  });
  s.addText("Final-Year Mini Project Review", {
    x: 0.9,
    y: 2.66,
    w: 2.55,
    h: 0.16,
    margin: 0,
    fontFace: "Calibri",
    bold: true,
    fontSize: 10.3,
    color: C.blue,
  });
  glassCard(s, 0.88, 4.55, 6.55, 1.58);
  s.addText("Team Members", {
    x: 1.16,
    y: 4.86,
    w: 1.2,
    h: 0.14,
    margin: 0,
    fontFace: "Calibri",
    bold: true,
    fontSize: 9.2,
    color: C.blue,
  });
  s.addText("AJAY M (23TD0003)   SHAFI AHMED F (23TD0076)   VIDYASAAGAR M (23TD0091)", {
    x: 1.16,
    y: 5.19,
    w: 5.94,
    h: 0.17,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.4,
    color: C.dark,
    fit: "shrink",
  });
  s.addText("Guide: Dr. R. G. Suresh Kumar", {
    x: 1.16,
    y: 5.52,
    w: 3.0,
    h: 0.15,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.2,
    color: C.softText,
  });
  s.addText("Computer Science and Engineering", {
    x: 4.52,
    y: 5.52,
    w: 2.26,
    h: 0.15,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.2,
    color: C.softText,
    fit: "shrink",
  });
  s.addText("Rajiv Gandhi College of Engineering and Technology", {
    x: 1.16,
    y: 5.82,
    w: 5.62,
    h: 0.15,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.2,
    color: C.softText,
    fit: "shrink",
  });

  glassCard(s, 8.7, 1.15, 3.65, 4.15);
  s.addShape(ST.ellipse, {
    x: 9.74,
    y: 2.15,
    w: 1.58,
    h: 1.58,
    fill: { color: C.white, transparency: 20 },
    line: { color: C.cyan, transparency: 10, width: 1.4 },
  });
  s.addShape(ST.ellipse, {
    x: 10.18,
    y: 2.59,
    w: 0.7,
    h: 0.7,
    fill: { color: C.cyan, transparency: 4 },
    line: { color: C.cyan, transparency: 100 },
  });
  const nodes = [
    [9.18, 1.74, "BRD", true],
    [11.12, 1.72, "SRS", false],
    [8.98, 3.8, "MAP", false],
    [11.3, 3.76, "AI", true],
    [10.18, 4.38, "TASK", false],
  ];
  nodes.forEach(([x, y, labelText, active]) => {
    slideNode(s, x, y, labelText, active);
  });
  [
    [9.43, 1.98, 10.2, 2.62],
    [11.12, 1.96, 10.84, 2.62],
    [9.23, 4.02, 10.16, 3.36],
    [11.3, 3.98, 10.86, 3.28],
    [10.43, 4.39, 10.5, 3.43],
  ].forEach(([x1, y1, x2, y2]) => {
    s.addShape(ST.line, {
      x: x1,
      y: y1,
      w: x2 - x1,
      h: y2 - y1,
      line: { color: C.indigo, transparency: 30, width: 1.1 },
    });
  });
  s.addText("From vague idea to structured plan, documents, and coding prompts.", {
    x: 8.98,
    y: 5.55,
    w: 3.05,
    h: 0.3,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 9.4,
    color: C.softText,
    fit: "shrink",
  });
  addBrand(s);
}

function slideNode(slide, x, y, labelText, active) {
  slide.addShape(ST.ellipse, {
    x,
    y,
    w: 0.54,
    h: 0.54,
    fill: { color: active ? C.cyan : C.white, transparency: active ? 0 : 18 },
    line: { color: active ? C.cyan : C.indigo, transparency: 28, width: 1 },
  });
  slide.addText(labelText, {
    x,
    y: y + 0.2,
    w: 0.54,
    h: 0.09,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 5.6,
    color: active ? C.white : C.indigo,
  });
}

function addAbstract() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 2, "Abstract", "BuildFlow AI guides project teams through planning, documentation, and implementation preparation.");
  card(s, 0.92, 2.0, 6.05, 4.3, { fill: C.panel });
  bulletList(
    s,
    [
      "Collects project requirements through a guided chatbot workflow.",
      "Stores stage-wise summaries as a reusable blueprint memory.",
      "Generates BRD, SRS, roadmap, and task outputs automatically.",
      "Creates implementation prompts for frontend, backend, and testing.",
      "Runs as a web platform using React, Node.js, Firebase, and OpenRouter.",
    ],
    1.3,
    2.52,
    5.2,
    { size: 13.1, gap: 0.62 }
  );
  glassCard(s, 8.0, 2.05, 3.95, 4.2);
  s.addShape(ST.roundRect, {
    x: 8.55,
    y: 3.05,
    w: 2.88,
    h: 1.3,
    rectRadius: 0.16,
    fill: { color: "EFF6FF" },
    line: { color: "BFDBFE", width: 1 },
  });
  s.addText("AI Planning Core", {
    x: 9.08,
    y: 3.47,
    w: 1.84,
    h: 0.18,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 13.4,
    color: C.dark,
  });
  const abstractNodes = [
    ["Chat", 8.35, 2.28, "chat", C.blue],
    ["Docs", 10.98, 2.2, "doc", C.indigo],
    ["Plan", 8.25, 4.92, "flow", C.cyan],
    ["Memory", 11.03, 4.88, "db", C.mint],
  ];
  abstractNodes.forEach(([txt, x, y, kind, color]) => {
    card(s, x, y, 1.1, 0.7, { fill: "FFFFFF" });
    icon(s, kind, x + 0.13, y + 0.15, 0.36, color, "F8FAFC");
    s.addText(txt, {
      x: x + 0.54,
      y: y + 0.26,
      w: 0.42,
      h: 0.12,
      margin: 0,
      fontFace: "Calibri",
      bold: true,
      fontSize: 7.8,
      color: C.dark,
      fit: "shrink",
    });
    s.addShape(ST.line, {
      x: x < 9.2 ? x + 1.08 : 9.98,
      y: y + 0.35,
      w: x < 9.2 ? 0.62 : x - 10.28,
      h: y < 4 ? 0.75 : -0.78,
      line: { color: "93C5FD", width: 1.1 },
    });
  });
  s.addText("AI + planning illustration", {
    x: 8.97,
    y: 5.76,
    w: 2.05,
    h: 0.14,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    fontSize: 8.4,
    color: C.slate,
  });
  addFooter(s, 2);
}

function addProblemStatement() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 3, "Problem Statement", "Students often have the idea for a project, but not a clean path from idea to execution.");
  card(s, 0.95, 2.0, 5.8, 4.35, { fill: C.panel });
  bulletList(
    s,
    [
      "Requirements are usually scattered across chats, notes, and rough documents.",
      "Teams struggle to define scope, users, features, and tech choices early.",
      "Academic deliverables like BRD and SRS take extra manual effort.",
      "Generic AI answers rarely preserve continuity across planning stages.",
      "Poor planning leads to rework, delays, and weak final presentations.",
    ],
    1.28,
    2.54,
    4.95,
    { size: 13.1, gap: 0.62 }
  );
  statCard(s, 7.35, 2.08, 4.6, 1.02, "Fragmented Inputs", "Idea notes, requirements, and feature decisions stay disconnected.", C.blue);
  statCard(s, 7.35, 3.34, 4.6, 1.02, "Weak Documentation Flow", "Specifications are prepared late and often miss consistency.", C.indigo);
  statCard(s, 7.35, 4.6, 4.6, 1.02, "Execution Gap", "Teams know what they want, but not how to begin building it.", C.cyan);
  addFooter(s, 3);
}

function addMotivation() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 4, "Motivation", "BuildFlow AI was created to make project planning faster, clearer, and more presentation-ready.");
  s.addText("The core idea:", {
    x: 0.98,
    y: 2.18,
    w: 1.35,
    h: 0.18,
    margin: 0,
    fontFace: "Calibri",
    bold: true,
    fontSize: 10.4,
    color: C.blue,
  });
  s.addText("planning should feel like a guided product experience, not a pile of disconnected files.", {
    x: 0.98,
    y: 2.5,
    w: 4.2,
    h: 1.18,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 24,
    color: C.dark,
    fit: "shrink",
  });
  bulletList(
    s,
    [
      "Students need a reliable starting structure for final-year mini projects.",
      "Reviewers expect clarity in both planning logic and generated artifacts.",
      "A five-stage workflow makes AI guidance easier to trust and explain.",
      "Persistent blueprint memory improves consistency across every output.",
    ],
    1.06,
    4.42,
    4.4,
    { size: 12.7, gap: 0.56 }
  );
  const cards = [
    ["Guided", "Moves from idea capture to output generation in a fixed flow.", "flow", C.blue],
    ["Consistent", "Reuses stored summaries instead of restarting every prompt.", "db", C.indigo],
    ["Review-Ready", "Produces materials that support academic demo and viva.", "doc", C.cyan],
  ];
  cards.forEach(([h, b, ic, color], i) => {
    const x = 6.2 + (i % 2) * 3.05;
    const y = 2.18 + Math.floor(i / 2) * 1.85;
    card(s, x, y, 2.65, 1.45, { fill: i === 2 ? C.panelCyan : C.panelBlue });
    icon(s, ic, x + 0.22, y + 0.25, 0.48, color, "FFFFFF");
    s.addText(h, {
      x: x + 0.84,
      y: y + 0.25,
      w: 1.4,
      h: 0.17,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 11.8,
      color: C.dark,
    });
    s.addText(b, {
      x: x + 0.22,
      y: y + 0.72,
      w: 2.05,
      h: 0.42,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 8.7,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 4);
}

function addObjectives() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 5, "Project Objectives", "The system is designed to reduce planning effort while improving structure and output quality.");
  const objectiveCards = [
    ["Capture project intent through guided conversation.", C.blue],
    ["Convert inputs into a reusable blueprint memory.", C.indigo],
    ["Generate BRD, SRS, roadmap, and task outputs.", C.cyan],
    ["Produce implementation prompts for development support.", C.mint],
    ["Deliver a deployable full-stack prototype for review.", C.amber],
  ];
  objectiveCards.forEach(([text, color], i) => {
    const x = i < 3 ? 0.96 + i * 4.05 : 3.0 + (i - 3) * 4.05;
    const y = i < 3 ? 2.18 : 4.1;
    card(s, x, y, 3.34, 1.3, { fill: "FFFFFF" });
    slideNumberBadge(s, x + 0.24, y + 0.24, i + 1, color);
    s.addText(text, {
      x: x + 0.86,
      y: y + 0.3,
      w: 2.15,
      h: 0.5,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 10.2,
      color: C.dark,
      bold: true,
      fit: "shrink",
    });
  });
  addFooter(s, 5);
}

function slideNumberBadge(slide, x, y, n, color) {
  slide.addShape(ST.roundRect, {
    x,
    y,
    w: 0.38,
    h: 0.38,
    rectRadius: 0.08,
    fill: { color },
    line: { color, transparency: 100 },
  });
  slide.addText(String(n), {
    x,
    y: y + 0.12,
    w: 0.38,
    h: 0.08,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 7.6,
    color: C.white,
  });
}

function addExistingSystem() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 6, "Existing System and Limitations", "Current options solve pieces of the problem, but they do not connect planning, memory, and academic outputs.");
  const columns = [
    ["Manual Planning", ["Depends on static templates", "Time-consuming BRD/SRS writing", "Low consistency across team members"], C.blue, "doc"],
    ["Generic AI Tools", ["Good at ideation, weak at continuity", "No built-in project memory", "Outputs need heavy manual cleanup"], C.indigo, "spark"],
    ["Task Management Tools", ["Track tasks but not requirements", "Do not generate documentation", "Little support for academic review flow"], C.cyan, "flow"],
  ];
  columns.forEach(([titleText, bullets, color, kind], i) => {
    const x = 0.9 + i * 4.1;
    card(s, x, 2.06, 3.45, 4.35, { fill: i === 1 ? C.panelBlue : "FFFFFF" });
    icon(s, kind, x + 0.24, 2.32, 0.48, color, "FFFFFF");
    s.addText(titleText, {
      x: x + 0.86,
      y: 2.36,
      w: 1.9,
      h: 0.18,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 11.8,
      color: C.dark,
    });
    bulletList(s, bullets, x + 0.28, 3.05, 2.7, { size: 11.5, gap: 0.74, dot: color });
  });
  addFooter(s, 6);
}

function addProposedSolution() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 7, "Proposed Solution", "BuildFlow AI introduces a guided planning workflow that connects context capture, memory, and output generation.");
  card(s, 4.65, 2.3, 4.0, 1.6, { fill: C.panelBlue, line: "BFDBFE" });
  s.addText("BuildFlow AI Engine", {
    x: 5.2,
    y: 2.72,
    w: 2.9,
    h: 0.2,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 17,
    color: C.dark,
  });
  s.addText("guided workflow + blueprint memory + generation services", {
    x: 5.1,
    y: 3.12,
    w: 3.1,
    h: 0.16,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    fontSize: 9.2,
    color: C.slate,
    fit: "shrink",
  });
  const nodes = [
    ["User Input", 1.08, 2.16, "chat", C.blue],
    ["AI Chat", 1.25, 4.38, "spark", C.indigo],
    ["Blueprint", 9.75, 2.16, "db", C.cyan],
    ["Outputs", 9.9, 4.38, "doc", C.mint],
  ];
  nodes.forEach(([txt, x, y, kind, color]) => {
    card(s, x, y, 2.15, 0.92, { fill: "FFFFFF" });
    icon(s, kind, x + 0.16, y + 0.22, 0.38, color, "F8FAFC");
    s.addText(txt, {
      x: x + 0.64,
      y: y + 0.33,
      w: 1.18,
      h: 0.14,
      margin: 0,
      fontFace: "Calibri",
      bold: true,
      fontSize: 9.3,
      color: C.dark,
      fit: "shrink",
    });
  });
  [
    [3.24, 2.62, 1.35, 0.48],
    [3.42, 4.82, 1.18, -0.9],
    [8.63, 2.62, 1.04, 0.48],
    [8.63, 3.52, 1.2, 0.94],
  ].forEach(([x, y, w, h]) => {
    s.addShape(ST.line, {
      x,
      y,
      w,
      h,
      line: { color: C.blue, width: 1.6, endArrowType: "triangle" },
    });
  });
  pill(s, "Single project memory feeds every output", 4.5, 4.92, 4.28, C.panelCyan, C.cyan);
  addFooter(s, 7);
}

function addKeyFeatures() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 8, "Key Features", "The platform focuses on the exact features needed for planning-heavy academic projects.");
  const features = [
    ["Guided Chat", "Collects structured planning inputs.", "chat", C.blue],
    ["Five-Stage Flow", "Moves from idea to stack decisions.", "flow", C.indigo],
    ["Blueprint Memory", "Stores summaries for reuse.", "db", C.cyan],
    ["Document Builder", "Creates BRD, SRS, roadmap, tasks.", "doc", C.mint],
    ["Prompt Generator", "Supports implementation planning.", "spark", C.amber],
    ["Secure Workspace", "Uses Firebase authentication and storage.", "shield", C.rose],
  ];
  features.forEach(([h, b, kind, color], i) => {
    const x = 0.95 + (i % 3) * 4.02;
    const y = 2.05 + Math.floor(i / 3) * 1.95;
    card(s, x, y, 3.32, 1.36, { fill: "FFFFFF" });
    icon(s, kind, x + 0.22, y + 0.26, 0.52, color, "F8FAFC");
    s.addText(h, {
      x: x + 0.92,
      y: y + 0.28,
      w: 1.95,
      h: 0.18,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 12.1,
      color: C.dark,
      fit: "shrink",
    });
    s.addText(b, {
      x: x + 0.92,
      y: y + 0.72,
      w: 1.95,
      h: 0.24,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 8.8,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 8);
}

function addArchitecture() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 9, "System Architecture", "The application is organized as a modular web stack with clear roles for frontend, backend, storage, and AI services.");
  card(s, 2.52, 1.98, 8.28, 4.8, { fill: "FFFFFF" });
  placeholder(s, 2.82, 2.26, 7.7, 4.18, "SYSTEM ARCHITECTURE DIAGRAM", "Insert final architecture diagram");
  statCard(s, 0.92, 2.22, 1.35, 1.05, "Client", "React + Vite UI", C.blue);
  statCard(s, 0.92, 3.54, 1.35, 1.05, "Auth", "Firebase sign-in", C.indigo);
  statCard(s, 11.0, 2.0, 1.35, 1.05, "API", "Node + Express", C.cyan);
  statCard(s, 11.0, 3.32, 1.35, 1.05, "Store", "Firestore memory", C.mint);
  statCard(s, 11.0, 4.64, 1.35, 1.05, "AI", "OpenRouter gateway", C.amber);
  addFooter(s, 9);
}

function addWorkflow() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 10, "Workflow Overview", "The user journey is designed as a clean timeline from sign-up to export.");
  const steps = [
    "Signup",
    "Create Project",
    "AI Chat",
    "Blueprint",
    "Generate Docs",
    "Generate Prompts",
    "Export",
  ];
  s.addShape(ST.line, {
    x: 1.02,
    y: 4.08,
    w: 11.1,
    h: 0,
    line: { color: "93C5FD", width: 2.2, endArrowType: "triangle" },
  });
  steps.forEach((step, i) => {
    const x = 0.98 + i * 1.77;
    s.addShape(ST.ellipse, {
      x,
      y: 3.86,
      w: 0.46,
      h: 0.46,
      fill: { color: i % 2 === 0 ? C.blue : C.cyan },
      line: { color: i % 2 === 0 ? C.blue : C.cyan, transparency: 100 },
    });
    s.addText(String(i + 1), {
      x,
      y: 4.02,
      w: 0.46,
      h: 0.08,
      margin: 0,
      align: "center",
      fontFace: "Calibri",
      bold: true,
      fontSize: 7.1,
      color: C.white,
    });
    card(s, x - 0.18, 2.42, 1.22, 0.84, { fill: i % 2 === 0 ? C.panelBlue : C.panelCyan });
    s.addText(step, {
      x: x - 0.08,
      y: 2.72,
      w: 1.0,
      h: 0.16,
      margin: 0,
      align: "center",
      fontFace: "Calibri",
      bold: true,
      fontSize: 8.7,
      color: C.dark,
      fit: "shrink",
    });
  });
  pill(s, "Timeline: Signup -> Create Project -> AI Chat -> Blueprint -> Generate Docs -> Generate Prompts -> Export", 1.05, 5.25, 10.95, C.panelBlue, C.blue);
  addFooter(s, 10);
}

function addTechStack() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 11, "Technology Stack", "BuildFlow AI uses a modern web stack chosen for speed, deployment flexibility, and AI integration.");
  const groups = [
    ["Frontend", ["React.js", "Vite", "Tailwind CSS"], C.blue],
    ["Backend", ["Node.js", "Express.js"], C.indigo],
    ["Platform", ["Firebase Authentication", "Firebase Firestore", "OpenRouter API"], C.cyan],
    ["Deployment", ["Vercel", "Render"], C.mint],
  ];
  groups.forEach(([labelText, items, color], gi) => {
    const x = gi < 2 ? 0.95 + gi * 6.1 : 0.95 + (gi - 2) * 6.1;
    const y = gi < 2 ? 2.1 : 4.3;
    card(s, x, y, 5.3, 1.6, { fill: gi % 2 ? C.panelCyan : C.panelBlue });
    pill(s, labelText, x + 0.24, y + 0.24, 1.12, color === C.blue ? C.panelBlue : "EAF2FF", color);
    items.forEach((item, i) => {
      slideBadge(s, item, x + 0.24 + (i % 3) * 1.6, y + 0.78 + Math.floor(i / 3) * 0.48, 1.42, color);
    });
  });
  addFooter(s, 11);
}

function slideBadge(slide, text, x, y, w, color = C.blue) {
  slide.addShape(ST.roundRect, {
    x,
    y,
    w,
    h: 0.32,
    rectRadius: 0.08,
    fill: { color: "FFFFFF" },
    line: { color, transparency: 58, width: 0.9 },
  });
  slide.addText(text, {
    x: x + 0.08,
    y: y + 0.09,
    w: w - 0.16,
    h: 0.1,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 7.3,
    color: C.dark,
    fit: "shrink",
  });
}

function addModules() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 12, "Module Description", "Each module supports one part of the planning workflow and keeps the system easier to maintain.");
  const modules = [
    ["Authentication", "Handles login, session control, and route protection.", "shield", C.blue],
    ["Dashboard", "Lists projects and quick actions for planning work.", "flow", C.indigo],
    ["Workspace", "Brings AI chat and project context into one screen.", "chat", C.cyan],
    ["AI Chat", "Collects stage-wise answers and generates summaries.", "spark", C.mint],
    ["Blueprint", "Stores reusable project memory across stages.", "db", C.amber],
    ["Outputs", "Displays BRD, SRS, roadmap, and to-do content.", "doc", C.blue],
    ["Prompts", "Generates coding prompts from stored planning data.", "gear", C.indigo],
    ["Settings", "Supports profile, preferences, and project-level options.", "flow", C.cyan],
  ];
  modules.forEach(([h, b, kind, color], i) => {
    const x = i < 4 ? 0.95 : 6.7;
    const y = 2.0 + (i % 4) * 1.05;
    card(s, x, y, 5.65, 0.82, { fill: "FFFFFF" });
    icon(s, kind, x + 0.18, y + 0.2, 0.38, color, "F8FAFC");
    s.addText(h, {
      x: x + 0.72,
      y: y + 0.18,
      w: 1.8,
      h: 0.14,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 10.6,
      color: C.dark,
    });
    s.addText(b, {
      x: x + 2.3,
      y: y + 0.2,
      w: 2.8,
      h: 0.13,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 8.2,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 12);
}

function addAiStages() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 13, "AI Planning Stages", "The five-stage workflow turns an idea into a project-ready blueprint step by step.");
  const stages = [
    "Idea & Goal",
    "Target Users & Use Cases",
    "Core Features",
    "UI/UX Preferences",
    "Tech Stack & Integrations",
  ];
  stages.forEach((stage, i) => {
    const x = 0.92 + i * 2.48;
    const y = 2.48 + (i % 2) * 0.36;
    card(s, x, y, 2.02, 1.95, { fill: i % 2 === 0 ? C.panelBlue : C.panelCyan });
    slideNumberBadge(s, x + 0.22, y + 0.22, i + 1, i % 2 === 0 ? C.blue : C.cyan);
    s.addText(stage, {
      x: x + 0.22,
      y: y + 0.78,
      w: 1.58,
      h: 0.44,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 12.2,
      color: C.dark,
      fit: "shrink",
    });
    if (i < stages.length - 1) {
      s.addShape(ST.line, {
        x: x + 2.03,
        y: y + 0.96,
        w: 0.42,
        h: i % 2 === 0 ? 0.3 : -0.3,
        line: { color: C.blue, width: 1.4, endArrowType: "triangle" },
      });
    }
  });
  addFooter(s, 13);
}

function addBlueprintMemory() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 14, "Blueprint Memory", "Stage summaries are stored as structured memory so every future output stays aligned to the same plan.");
  card(s, 0.98, 2.0, 3.9, 4.5, { fill: "FFFFFF" });
  s.addText("Stored summaries", {
    x: 1.32,
    y: 2.32,
    w: 1.78,
    h: 0.18,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 13.8,
    color: C.dark,
  });
  bulletList(
    s,
    [
      "Problem and project goal",
      "Target users and use cases",
      "Feature priorities and constraints",
      "UI/UX preferences",
      "Tech stack and integrations",
    ],
    1.34,
    2.86,
    2.85,
    { size: 11.8, gap: 0.66 }
  );
  s.addShape(ST.chevron, {
    x: 5.3,
    y: 3.6,
    w: 1.0,
    h: 0.62,
    fill: { color: C.blue, transparency: 8 },
    line: { color: C.blue, transparency: 100 },
  });
  card(s, 6.75, 2.12, 2.1, 3.95, { fill: C.panelBlue });
  icon(s, "db", 7.5, 2.68, 0.62, C.cyan, "FFFFFF");
  s.addText("Firestore", {
    x: 7.06,
    y: 3.55,
    w: 1.5,
    h: 0.22,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 14.8,
    color: C.dark,
  });
  s.addText("Persistent blueprint memory", {
    x: 7.0,
    y: 4.02,
    w: 1.62,
    h: 0.38,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    fontSize: 8.8,
    color: C.slate,
    fit: "shrink",
  });
  const outputs = [
    ["BRD", 9.5, 2.28],
    ["SRS", 10.95, 2.9],
    ["Roadmap", 9.55, 4.12],
    ["To-Do", 11.05, 4.72],
  ];
  outputs.forEach(([txt, x, y], i) => {
    card(s, x, y, 1.38, 0.76, { fill: i % 2 === 0 ? C.panelBlue : C.panelCyan });
    s.addText(txt, {
      x,
      y: y + 0.28,
      w: 1.38,
      h: 0.12,
      margin: 0,
      align: "center",
      fontFace: "Calibri",
      bold: true,
      fontSize: 8.2,
      color: C.dark,
      fit: "shrink",
    });
    s.addShape(ST.line, {
      x: 8.83,
      y: 4.02,
      w: x - 8.96,
      h: y + 0.38 - 4.02,
      line: { color: "93C5FD", width: 1.1, endArrowType: "triangle" },
    });
  });
  addFooter(s, 14);
}

function addDocumentGeneration() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 15, "Document Generation", "From one project blueprint, the platform produces the core planning documents reviewers expect.");
  const docs = [
    ["BRD", "Business Requirements Document", C.blue],
    ["SRS", "Software Requirements Specification", C.indigo],
    ["Roadmap", "Phases, milestones, and execution order", C.cyan],
    ["To-Do List", "Actionable task breakdown for development", C.mint],
  ];
  docs.forEach(([h, b, color], i) => {
    const x = 0.95 + i * 3.08;
    card(s, x, 2.22, 2.62, 3.64, { fill: "FFFFFF" });
    icon(s, "doc", x + 0.96, 2.58, 0.64, color, "F8FAFC");
    s.addText(h, {
      x: x + 0.22,
      y: 3.45,
      w: 2.18,
      h: 0.18,
      margin: 0,
      align: "center",
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 13.5,
      color: C.dark,
      fit: "shrink",
    });
    s.addText(b, {
      x: x + 0.22,
      y: 4.02,
      w: 2.18,
      h: 0.52,
      margin: 0,
      align: "center",
      fontFace: "Calibri",
      fontSize: 8.7,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 15);
}

function addPromptGeneration() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 16, "Prompt Generation", "BuildFlow AI also creates implementation prompts so planning decisions can move smoothly into coding work.");
  card(s, 0.96, 2.02, 4.52, 4.48, { fill: C.panelBlue });
  s.addText("Prompt categories", {
    x: 1.28,
    y: 2.34,
    w: 1.72,
    h: 0.18,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 13.8,
    color: C.dark,
  });
  const categories = [
    ["Frontend", C.blue],
    ["Backend", C.indigo],
    ["Database", C.cyan],
    ["Testing", C.mint],
    ["Deployment", C.amber],
  ];
  categories.forEach(([txt, color], i) => {
    slideBadge(s, txt, 1.3 + (i % 2) * 1.82, 2.9 + Math.floor(i / 2) * 0.58, 1.52, color);
  });
  s.addText("Each prompt carries the chosen stack, project context, scope, and expected output style.", {
    x: 1.3,
    y: 5.25,
    w: 3.6,
    h: 0.4,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 9.3,
    color: C.slate,
    fit: "shrink",
  });
  card(s, 6.22, 2.02, 5.98, 4.48, { fill: "FFFFFF" });
  bulletList(
    s,
    [
      "Reduces ambiguity before coding begins.",
      "Keeps AI coding tools aligned to the approved plan.",
      "Supports module-wise implementation and explanation.",
      "Helps students justify design and testing choices.",
      "Acts as a bridge between planning and development.",
    ],
    6.64,
    2.72,
    4.9,
    { size: 12.6, gap: 0.68 }
  );
  addFooter(s, 16);
}

function addComparison() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 17, "Comparison with Existing Tools", "BuildFlow AI stands out by combining context memory, academic documentation, and implementation prompts.");
  card(s, 0.88, 2.0, 11.6, 4.7, { fill: "FFFFFF" });
  const cols = [3.1, 2.4, 2.3, 2.2, 1.6];
  const headers = ["Capability", "Traditional Tools", "ChatGPT", "BuildFlow AI", "Best Fit"];
  let cx = 0.88;
  headers.forEach((header, i) => {
    s.addShape(ST.rect, {
      x: cx,
      y: 2.0,
      w: cols[i],
      h: 0.56,
      fill: { color: i === 3 ? C.blue : "EEF4FF" },
      line: { color: C.line, transparency: 20 },
    });
    s.addText(header, {
      x: cx + 0.1,
      y: 2.2,
      w: cols[i] - 0.2,
      h: 0.12,
      margin: 0,
      align: i === 0 ? "left" : "center",
      fontFace: "Calibri",
      bold: true,
      fontSize: 7.6,
      color: i === 3 ? C.white : C.dark,
      fit: "shrink",
    });
    cx += cols[i];
  });
  const rows = [
    ["Project planning guidance", "Manual", "Idea-level", "Structured workflow", "BuildFlow AI"],
    ["Persistent context memory", "Low", "Session-based", "Blueprint reuse", "BuildFlow AI"],
    ["BRD / SRS generation", "External", "Possible, but manual", "Built-in outputs", "BuildFlow AI"],
    ["Implementation prompts", "Rare", "Generic", "Project-specific", "BuildFlow AI"],
    ["Academic review readiness", "Variable", "Variable", "Strong", "BuildFlow AI"],
  ];
  rows.forEach((row, r) => {
    cx = 0.88;
    row.forEach((cell, c) => {
      const yy = 2.56 + r * 0.78;
      s.addShape(ST.rect, {
        x: cx,
        y: yy,
        w: cols[c],
        h: 0.78,
        fill: { color: c === 3 ? "EFF6FF" : "FFFFFF" },
        line: { color: C.line, transparency: 24 },
      });
      s.addText(cell, {
        x: cx + 0.1,
        y: yy + 0.29,
        w: cols[c] - 0.2,
        h: 0.12,
        margin: 0,
        align: c === 0 ? "left" : "center",
        fontFace: "Calibri",
        bold: c === 0 || c === 3 || c === 4,
        fontSize: 7.7,
        color: c === 3 ? C.blue : C.softText,
        fit: "shrink",
      });
      cx += cols[c];
    });
  });
  addFooter(s, 17);
}

function addTesting() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 18, "Testing and Validation", "Testing focused on whether the workflow, outputs, and deployment experience worked reliably end to end.");
  const tests = [
    ["Authentication flow", "Passed", "Login, logout, and protected access."],
    ["Project creation", "Passed", "New project workspace and saved details."],
    ["AI stage collection", "Passed", "Stage-wise input and summary generation."],
    ["Document outputs", "Passed", "BRD, SRS, roadmap, and task creation."],
    ["Prompt outputs", "Passed", "Context-aware implementation prompts."],
  ];
  tests.forEach(([name, status, desc], i) => {
    const x = i < 3 ? 0.96 + i * 4.0 : 2.98 + (i - 3) * 4.0;
    const y = i < 3 ? 2.12 : 4.12;
    card(s, x, y, 3.2, 1.38, { fill: "FFFFFF" });
    pill(s, status, x + 0.22, y + 0.22, 0.82, "DCFCE7", "15803D");
    s.addText(name, {
      x: x + 0.22,
      y: y + 0.64,
      w: 1.95,
      h: 0.16,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 10.6,
      color: C.dark,
      fit: "shrink",
    });
    s.addText(desc, {
      x: x + 0.22,
      y: y + 0.94,
      w: 2.55,
      h: 0.2,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 8.2,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 18);
}

function addScreenshots() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 19, "Application Screenshots", "Insert final product screens here. The final review deck should show both light and dark theme support.");
  const shots = [
    ["Landing Page", 0.92, 2.08, 2.2, 1.55],
    ["Dashboard", 3.38, 2.08, 2.2, 1.55],
    ["Workspace", 5.84, 2.08, 2.2, 1.55],
    ["Generated BRD", 8.3, 2.08, 2.2, 1.55],
    ["Prompt Panel", 10.76, 2.08, 1.65, 1.55],
  ];
  shots.forEach(([labelText, x, y, w, h]) => {
    placeholder(s, x, y, w, h, labelText.toUpperCase(), "Screenshot placeholder");
  });
  card(s, 0.92, 4.28, 11.5, 1.45, { fill: C.panelBlue });
  s.addText("Demonstrates both Light and Dark Theme support.", {
    x: 1.2,
    y: 4.7,
    w: 4.2,
    h: 0.18,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 12.2,
    color: C.dark,
  });
  s.addText("Suggested inserts: Login page, Create Project page, Workspace chat + blueprint, generated BRD view, prompt generation panel, and theme variations.", {
    x: 1.2,
    y: 5.06,
    w: 9.6,
    h: 0.18,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 9.2,
    color: C.slate,
    fit: "shrink",
  });
  addFooter(s, 19);
}

function addResults() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 20, "Results and Benefits", "The prototype improves planning quality by turning scattered thinking into structured project outputs.");
  const resultCards = [
    ["Time Saved", "Faster movement from idea to first structured plan.", C.blue],
    ["Better Documentation", "Cleaner BRD and SRS preparation for review.", C.indigo],
    ["Planning Efficiency", "Less repetition across chat, docs, and tasks.", C.cyan],
  ];
  resultCards.forEach(([h, b, color], i) => {
    const x = 0.95 + i * 4.05;
    const y = 2.18;
    card(s, x, 2.18, 3.34, 1.62, { fill: i === 1 ? C.panelBlue : "FFFFFF" });
    s.addShape(ST.rect, {
      x,
      y,
      w: 0.1,
      h: 1.62,
      fill: { color },
      line: { color, transparency: 100 },
    });
    s.addText(h, {
      x: x + 0.24,
      y: 2.52,
      w: 2.55,
      h: 0.18,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 12.6,
      color: C.dark,
    });
    s.addText(b, {
      x: x + 0.24,
      y: 2.94,
      w: 2.7,
      h: 0.32,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 9.1,
      color: C.slate,
      fit: "shrink",
    });
  });
  card(s, 0.95, 4.3, 11.45, 1.72, { fill: "FFFFFF" });
  bulletList(
    s,
    [
      "One blueprint drives documents, roadmap, tasks, and prompts.",
      "Reviewers can understand the workflow even with a quick glance through the deck.",
      "The system supports both project explanation and implementation planning.",
      "The architecture is ready for live demo and future feature growth.",
    ],
    1.3,
    4.74,
    9.9,
    { size: 11.8, gap: 0.32 }
  );
  addFooter(s, 20);
}

function addFutureEnhancements() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 21, "Future Enhancements", "The next version can move from planning assistant to a more complete project execution companion.");
  const future = [
    ["Team Collaboration", "Shared workspaces, comments, and approval flow.", C.blue],
    ["UML Auto-Generation", "Convert blueprint data into diagrams automatically.", C.indigo],
    ["DOCX / PPT Export", "Download formatted reports and presentation assets.", C.cyan],
    ["Voice Planning", "Collect planning inputs through voice-guided interaction.", C.mint],
  ];
  future.forEach(([h, b, color], i) => {
    const x = 1.1 + (i % 2) * 5.5;
    const y = 2.2 + Math.floor(i / 2) * 1.9;
    card(s, x, y, 4.62, 1.42, { fill: i % 2 === 0 ? C.panelBlue : C.panelCyan });
    slideNumberBadge(s, x + 0.22, y + 0.24, i + 1, color);
    s.addText(h, {
      x: x + 0.78,
      y: y + 0.28,
      w: 2.7,
      h: 0.18,
      margin: 0,
      fontFace: "Bahnschrift",
      bold: true,
      fontSize: 12.2,
      color: C.dark,
      fit: "shrink",
    });
    s.addText(b, {
      x: x + 0.22,
      y: y + 0.78,
      w: 3.85,
      h: 0.24,
      margin: 0,
      fontFace: "Calibri",
      fontSize: 8.8,
      color: C.slate,
      fit: "shrink",
    });
  });
  addFooter(s, 21);
}

function addConclusion() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  addTitle(s, 22, "Conclusion", "BuildFlow AI helps students move from raw ideas to execution-ready planning with better structure and less manual effort.");
  s.addText("BuildFlow AI brings planning, memory, documents, and prompts into one clear workflow.", {
    x: 1.0,
    y: 2.3,
    w: 6.35,
    h: 0.82,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 28,
    color: C.dark,
    fit: "shrink",
  });
  bulletList(
    s,
    [
      "Improves planning clarity for final-year mini projects.",
      "Supports academic deliverables without breaking workflow continuity.",
      "Creates a stronger bridge between planning discussion and coding execution.",
    ],
    1.05,
    4.0,
    5.6,
    { size: 12.6, gap: 0.68 }
  );
  statCard(s, 7.55, 2.34, 3.92, 1.06, "What it changes", "Reviewers see a structured process, not just final output screens.", C.blue);
  statCard(s, 7.55, 3.72, 3.92, 1.06, "Why it matters", "Better planning improves implementation quality and presentation confidence.", C.indigo);
  statCard(s, 7.55, 5.1, 3.92, 1.06, "Project impact", "A practical AI assistant for student project planning workflows.", C.cyan);
  addFooter(s, 22);
}

function addLiveDemo() {
  const s = pptx.addSlide();
  addBackground(s, "right");
  addTitle(s, 23, "Live Demo", "Use this slide during the demo to guide reviewers through the deployed product flow.");
  card(s, 0.95, 2.0, 4.38, 4.56, { fill: "FFFFFF" });
  s.addText("Demo flow", {
    x: 1.28,
    y: 2.34,
    w: 1.36,
    h: 0.18,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 13.2,
    color: C.dark,
  });
  bulletList(
    s,
    [
      "Open deployed application",
      "Create or select a project",
      "Complete stage-wise AI chat",
      "Show blueprint memory",
      "Generate BRD and prompts",
    ],
    1.32,
    2.86,
    2.95,
    { size: 12, gap: 0.66 }
  );
  card(s, 6.0, 2.0, 5.4, 2.12, { fill: C.panelBlue });
  s.addText("Deployed URL", {
    x: 6.36,
    y: 2.36,
    w: 1.45,
    h: 0.16,
    margin: 0,
    fontFace: "Calibri",
    bold: true,
    fontSize: 9.3,
    color: C.blue,
  });
  placeholder(s, 6.32, 2.72, 4.72, 0.86, "URL PLACEHOLDER", "Insert deployed URL");
  card(s, 6.0, 4.42, 2.2, 2.14, { fill: "FFFFFF" });
  placeholder(s, 6.35, 4.76, 1.5, 1.42, "QR CODE", "Insert QR");
  card(s, 8.6, 4.42, 2.8, 2.14, { fill: C.panelCyan });
  s.addText("Reviewer cue", {
    x: 8.92,
    y: 4.78,
    w: 1.2,
    h: 0.16,
    margin: 0,
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 10.8,
    color: C.dark,
  });
  s.addText("Show one project from input collection to generated BRD and prompts.", {
    x: 8.92,
    y: 5.15,
    w: 1.95,
    h: 0.5,
    margin: 0,
    fontFace: "Calibri",
    fontSize: 8.5,
    color: C.slate,
    fit: "shrink",
  });
  addFooter(s, 23);
}

function addThankYou() {
  const s = pptx.addSlide();
  addBackground(s, "left");
  s.addShape(ST.arc, {
    x: 8.72,
    y: 0.95,
    w: 3.9,
    h: 3.9,
    rotate: 12,
    fill: { color: "DBEAFE", transparency: 12 },
    line: { color: "DBEAFE", transparency: 100 },
  });
  s.addText("Thank You", {
    x: 2.24,
    y: 1.88,
    w: 8.8,
    h: 0.72,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 34,
    color: C.dark,
    fit: "shrink",
  });
  s.addText("Questions?", {
    x: 4.66,
    y: 2.84,
    w: 4.0,
    h: 0.3,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    bold: true,
    fontSize: 20,
    color: C.slate,
  });
  glassCard(s, 3.24, 4.14, 6.9, 1.62);
  s.addText("BuildFlow AI - AI-Based Project Planning Assistant", {
    x: 3.62,
    y: 4.6,
    w: 6.1,
    h: 0.18,
    margin: 0,
    align: "center",
    fontFace: "Bahnschrift",
    bold: true,
    fontSize: 12.2,
    color: C.dark,
    fit: "shrink",
  });
  s.addText("AJAY M | SHAFI AHMED F | VIDYASAAGAR M", {
    x: 3.62,
    y: 5.05,
    w: 6.1,
    h: 0.16,
    margin: 0,
    align: "center",
    fontFace: "Calibri",
    fontSize: 9.2,
    color: C.slate,
    fit: "shrink",
  });
  addBrand(s);
  addFooter(s, 24);
}

function addTransitions(pptxPath, slideCount) {
  return fs.readFile(pptxPath).then((buf) => JSZip.loadAsync(buf)).then(async (zip) => {
    for (let i = 1; i <= slideCount; i++) {
      const file = `ppt/slides/slide${i}.xml`;
      let xml = await zip.file(file).async("string");
      const animatedIds = [...xml.matchAll(/<p:cNvPr id="(\d+)" name="Text \d+"/g)]
        .slice(0, 4)
        .map((m) => m[1]);
      const timing = animatedIds.length ? buildFadeTiming(animatedIds) : "";
      const transition = i === 1 || i === 7 || i === 13 || i === 19 || i === 24
        ? '<p:transition spd="med"><p:zoom dir="in"/></p:transition>'
        : '<p:transition spd="med"><p:fade/></p:transition>';
      xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, "");
      xml = xml.replace(/<p:timing>[\s\S]*?<\/p:timing>/g, "");
      xml = xml.replace("</p:sld>", `${transition}${timing}</p:sld>`);
      zip.file(file, xml);
    }
    const out = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    await fs.writeFile(pptxPath, out);
  });
}

function buildFadeTiming(spids) {
  let id = 10;
  const effects = spids.map((spid, idx) => {
    const delay = idx === 0 ? 0 : 120 + idx * 60;
    const ids = [id++, id++, id++, id++];
    return `<p:par><p:cTn id="${ids[0]}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${ids[1]}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="clickEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${ids[2]}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${ids[3]}" dur="480" fill="hold"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
  }).join("");
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${effects}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
}

async function renderPreviews(pptxPath) {
  await fs.rm(PREVIEW_DIR, { recursive: true, force: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  const imported = await PresentationFile.importPptx(await FileBlob.load(pptxPath));
  const previewPaths = [];
  for (let i = 0; i < imported.slides.count; i++) {
    const slide = imported.slides.getItem(i);
    const png = await imported.export({ format: "png", slide });
    const out = path.join(PREVIEW_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await fs.writeFile(out, Buffer.from(await png.arrayBuffer()));
    previewPaths.push(out);
  }
  let inspectSummary = null;
  try {
    inspectSummary = imported.inspect ? await imported.inspect({}) : null;
  } catch (error) {
    inspectSummary = { error: String(error?.message || error) };
  }
  return { slideCount: imported.slides.count, previewPaths, inspectSummary };
}

async function scanDeck(pptxPath, slideCount) {
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  const placeholderHits = [];
  let transitionCount = 0;
  let timingCount = 0;
  for (let i = 1; i <= slideCount; i++) {
    const xml = await zip.file(`ppt/slides/slide${i}.xml`).async("string");
    if (xml.includes("<p:transition")) transitionCount += 1;
    if (xml.includes("<p:timing")) timingCount += 1;
    if (xml.includes("sldNum") || xml.includes("Slide Number")) placeholderHits.push(i);
  }
  return { transitionCount, timingCount, placeholderHits };
}

function buildDeck() {
  addCover();
  addAbstract();
  addProblemStatement();
  addMotivation();
  addObjectives();
  addExistingSystem();
  addProposedSolution();
  addKeyFeatures();
  addArchitecture();
  addWorkflow();
  addTechStack();
  addModules();
  addAiStages();
  addBlueprintMemory();
  addDocumentGeneration();
  addPromptGeneration();
  addComparison();
  addTesting();
  addScreenshots();
  addResults();
  addFutureEnhancements();
  addConclusion();
  addLiveDemo();
  addThankYou();
}

async function main() {
  buildDeck();
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.mkdir("scratch", { recursive: true });
  await pptx.writeFile({ fileName: OUT, compression: true });
  await addTransitions(OUT, 24);
  const render = await renderPreviews(OUT);
  const scan = await scanDeck(OUT, render.slideCount);
  await fs.writeFile(
    QA_JSON,
    JSON.stringify(
      {
        deck: OUT,
        slideCount: render.slideCount,
        previewPaths: render.previewPaths,
        transitionCount: scan.transitionCount,
        timingCount: scan.timingCount,
        nativePlaceholderHits: scan.placeholderHits,
        inspectSummary: render.inspectSummary,
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify(
      {
        deck: OUT,
        slideCount: render.slideCount,
        previewDir: PREVIEW_DIR,
        qaJson: QA_JSON,
        transitionCount: scan.transitionCount,
        timingCount: scan.timingCount,
        nativePlaceholderHits: scan.placeholderHits,
      },
      null,
      2
    )
  );
}

await main();
