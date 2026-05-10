import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const OUT = path.resolve("output/BuildFlow_AI_Project_Planning_Assistant.pptx");
const PREVIEW_DIR = path.resolve("scratch/previews");
const QA_JSON = path.resolve("scratch/qa-report.json");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "BuildFlow AI Team";
pptx.company = "Rajiv Gandhi College of Engineering and Technology";
pptx.subject = "Final-year mini project review presentation";
pptx.title = "BuildFlow AI - AI-Based Project Planning Assistant";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Poppins SemiBold",
  bodyFontFace: "Aptos",
  lang: "en-US",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  blue: "2563EB",
  cyan: "06B6D4",
  navy: "0F172A",
  white: "FFFFFF",
  light: "F8FAFC",
  slate: "475569",
  line: "D7E3F7",
  paleBlue: "EAF2FF",
  ink: "102033",
  green: "14B8A6",
  amber: "F59E0B",
};

const W = 13.333;
const H = 7.5;
const ST = pptx.ShapeType;

function addBg(slide, variant = "light") {
  if (variant === "dark") {
    slide.background = { color: C.navy };
    slide.addShape(ST.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "08111F" }, line: { color: "08111F", transparency: 100 } });
    slide.addShape(ST.arc, { x: -1.2, y: -1.2, w: 5.8, h: 5.8, adjustPoint: 0.2, rotate: 10, fill: { color: C.blue, transparency: 44 }, line: { color: C.blue, transparency: 100 } });
    slide.addShape(ST.arc, { x: 8.6, y: 3.7, w: 6.2, h: 6.2, rotate: 210, fill: { color: C.cyan, transparency: 62 }, line: { color: C.cyan, transparency: 100 } });
    slide.addShape(ST.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy, transparency: 15 }, line: { color: C.navy, transparency: 100 } });
    addGrid(slide, "FFFFFF", 94);
  } else {
    slide.background = { color: C.light };
    slide.addShape(ST.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.light }, line: { color: C.light, transparency: 100 } });
    slide.addShape(ST.arc, { x: -1.1, y: -1, w: 4.8, h: 4.8, rotate: 16, fill: { color: "D9E8FF", transparency: 6 }, line: { color: "D9E8FF", transparency: 100 } });
    slide.addShape(ST.arc, { x: 9.2, y: 4.2, w: 5.4, h: 5.4, rotate: 204, fill: { color: "CFFAFE", transparency: 15 }, line: { color: "CFFAFE", transparency: 100 } });
    addGrid(slide, "CBD5E1", 86);
  }
}

function addGrid(slide, color, transparency) {
  for (let x = 0.4; x < W; x += 0.8) {
    slide.addShape(ST.line, { x, y: 0, w: 0, h: H, line: { color, transparency, width: 0.35 } });
  }
  for (let y = 0.4; y < H; y += 0.8) {
    slide.addShape(ST.line, { x: 0, y, w: W, h: 0, line: { color, transparency, width: 0.35 } });
  }
}

function title(slide, t, sub, variant = "light") {
  const dark = variant === "dark";
  slide.addText(t, {
    x: 0.65, y: 0.42, w: 8.9, h: 0.55,
    margin: 0, breakLine: false, fit: "shrink",
    fontFace: "Poppins SemiBold", bold: true, fontSize: 25,
    color: dark ? C.white : C.navy,
  });
  slide.addShape(ST.line, { x: 0.67, y: 1.09, w: 1.1, h: 0, line: { color: C.cyan, width: 3, transparency: 0 } });
  if (sub) slide.addText(sub, {
    x: 0.65, y: 1.18, w: 8.8, h: 0.36,
    margin: 0, fontFace: "Aptos", fontSize: 11.5,
    color: dark ? "BBD0EA" : C.slate,
    fit: "shrink",
  });
  slide.addText("BuildFlow AI", {
    x: 11.0, y: 0.48, w: 1.45, h: 0.25, align: "right",
    margin: 0, fontFace: "Aptos", bold: true, fontSize: 8.8,
    color: dark ? "BBD0EA" : C.blue,
  });
}

function footer(slide, n, variant = "light") {
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.45, y: 7.05, w: 0.25, h: 0.17, margin: 0,
    fontFace: "Aptos", bold: true, fontSize: 7.8,
    color: variant === "dark" ? "BBD0EA" : "64748B",
    align: "right",
  });
  slide.addShape(ST.line, { x: 0.65, y: 7.12, w: 11.55, h: 0, line: { color: variant === "dark" ? "334155" : "D8E2F0", width: 0.6 } });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(ST.roundRect, {
    x: x + 0.06, y: y + 0.08, w, h,
    rectRadius: 0.05,
    fill: { color: opts.shadowColor || "0B1020", transparency: opts.shadowT ?? 88 },
    line: { color: opts.shadowColor || "0B1020", transparency: 100 },
  });
  slide.addShape(ST.roundRect, {
    x, y, w, h,
    rectRadius: opts.r ?? 0.08,
    fill: { color: opts.fill || C.white, transparency: opts.transparency ?? 8 },
    line: { color: opts.line || "DDEBFF", transparency: opts.lineT ?? 10, width: opts.lineW ?? 1 },
    shadow: opts.shadow ?? { type: "outer", color: "1E293B", opacity: 0.11, blur: 2.2, angle: 45, distance: 1.2 },
  });
}

function label(slide, txt, x, y, w, fill = C.paleBlue, color = C.blue) {
  slide.addShape(ST.roundRect, { x, y, w, h: 0.32, rectRadius: 0.12, fill: { color: fill, transparency: 0 }, line: { color: fill, transparency: 100 } });
  slide.addText(txt, { x, y: y + 0.075, w, h: 0.14, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 7.4, color, fit: "shrink" });
}

function addIcon(slide, kind, x, y, s = 0.42, color = C.blue, bg = "EEF6FF") {
  slide.addShape(ST.ellipse, { x, y, w: s, h: s, fill: { color: bg, transparency: 0 }, line: { color: color, transparency: 75 } });
  const cx = x + s / 2;
  const cy = y + s / 2;
  const lw = 1.25;
  if (kind === "spark") {
    slide.addShape(ST.line, { x: cx, y: y + 0.09, w: 0, h: s - 0.18, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + 0.09, y: cy, w: s - 0.18, h: 0, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + 0.14, y: y + 0.14, w: s - 0.28, h: s - 0.28, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s - 0.14, y: y + 0.14, w: -(s - 0.28), h: s - 0.28, line: { color, width: lw } });
  } else if (kind === "doc") {
    slide.addShape(ST.roundRect, { x: x + s * 0.29, y: y + s * 0.19, w: s * 0.42, h: s * 0.55, rectRadius: 0.02, fill: { color: C.white, transparency: 8 }, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s * 0.36, y: y + s * 0.37, w: s * 0.25, h: 0, line: { color, width: lw } });
    slide.addShape(ST.line, { x: x + s * 0.36, y: y + s * 0.50, w: s * 0.22, h: 0, line: { color, width: lw } });
  } else if (kind === "db") {
    slide.addShape(ST.can, { x: x + s * 0.24, y: y + s * 0.2, w: s * 0.52, h: s * 0.58, fill: { color: C.white, transparency: 10 }, line: { color, width: lw } });
  } else if (kind === "gear") {
    slide.addShape(ST.ellipse, { x: x + s * 0.31, y: y + s * 0.31, w: s * 0.38, h: s * 0.38, fill: { color: C.white, transparency: 100 }, line: { color, width: lw } });
    for (const a of [0, 45, 90, 135]) {
      const len = s * 0.18;
      slide.addShape(ST.line, { x: cx - len / 2, y: cy, w: len, h: 0, rotate: a, line: { color, width: lw } });
    }
  } else if (kind === "shield") {
    slide.addShape(ST.homePlate, { x: x + s * 0.26, y: y + s * 0.20, w: s * 0.48, h: s * 0.52, rotate: 90, fill: { color: C.white, transparency: 100 }, line: { color, width: lw } });
  } else if (kind === "cloud") {
    slide.addShape(ST.cloud, { x: x + s * 0.2, y: y + s * 0.28, w: s * 0.6, h: s * 0.42, fill: { color: C.white, transparency: 100 }, line: { color, width: lw } });
  } else {
    slide.addText(kind.toUpperCase().slice(0, 2), { x, y: y + s * 0.33, w: s, h: s * 0.22, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 7.5, color });
  }
}

function bulletList(slide, items, x, y, w, opts = {}) {
  const size = opts.size ?? 14;
  const gap = opts.gap ?? 0.47;
  items.slice(0, 5).forEach((it, i) => {
    const yy = y + i * gap;
    slide.addShape(ST.ellipse, { x, y: yy + 0.08, w: 0.12, h: 0.12, fill: { color: opts.dot || C.cyan }, line: { color: opts.dot || C.cyan, transparency: 100 } });
    slide.addText(it, {
      x: x + 0.24, y: yy, w, h: 0.25, margin: 0,
      fontFace: "Aptos", fontSize: size, bold: opts.bold ?? false,
      color: opts.color || C.ink, fit: "shrink", breakLine: false,
    });
  });
}

function bigNumber(slide, n, textLine, x, y, color = C.blue) {
  slide.addText(n, { x, y, w: 0.68, h: 0.48, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 28, color });
  slide.addText(textLine, { x: x + 0.75, y: y + 0.08, w: 2.4, h: 0.25, margin: 0, fontFace: "Aptos", fontSize: 11.5, bold: true, color: C.ink, fit: "shrink" });
}

function placeholder(slide, x, y, w, h, titleText, sub = "Replace with final image") {
  slide.addShape(ST.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: "F8FBFF", transparency: 5 }, line: { color: "7FB3FF", transparency: 0, width: 1.2, dash: "dash" } });
  slide.addShape(ST.line, { x: x + 0.18, y: y + 0.18, w: w - 0.36, h: h - 0.36, line: { color: "A9C8F8", width: 0.8, transparency: 15, dash: "dash" } });
  slide.addShape(ST.line, { x: x + w - 0.18, y: y + 0.18, w: -(w - 0.36), h: h - 0.36, line: { color: "A9C8F8", width: 0.8, transparency: 15, dash: "dash" } });
  slide.addText(titleText, { x: x + 0.28, y: y + h / 2 - 0.23, w: w - 0.56, h: 0.24, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 15, color: C.blue, fit: "shrink" });
  slide.addText(sub, { x: x + 0.28, y: y + h / 2 + 0.12, w: w - 0.56, h: 0.18, margin: 0, align: "center", fontFace: "Aptos", fontSize: 9, color: "64748B", fit: "shrink" });
}

function addNotes(slide, lines) {
  slide.addNotes(lines.join("\n"));
}

function addCover() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  s.addText("BuildFlow AI", {
    x: 0.82, y: 1.08, w: 8.4, h: 0.8,
    margin: 0, fontFace: "Poppins SemiBold", bold: true,
    fontSize: 48, color: C.white, fit: "shrink",
    shadow: { type: "outer", color: C.cyan, opacity: 0.45, blur: 2, angle: 45, distance: 1 },
  });
  s.addText("AI-Based Project Planning Assistant", {
    x: 0.86, y: 2.02, w: 6.8, h: 0.36, margin: 0,
    fontFace: "Aptos", fontSize: 17.5, color: "BBD0EA",
    fit: "shrink",
  });
  s.addText("Final-Year Mini Project Review", {
    x: 0.86, y: 2.56, w: 3.1, h: 0.27, margin: 0,
    fontFace: "Aptos", bold: true, fontSize: 10.5, color: C.cyan,
  });
  ["BRD", "SRS", "ROADMAP", "TASKS", "PROMPTS"].forEach((txt, i) => {
    const x = 8.55 + (i % 2) * 1.6;
    const y = 1.1 + Math.floor(i / 2) * 1.02;
    card(s, x, y, 1.22, 0.62, { fill: "FFFFFF", transparency: 87, line: "A7F3D0", lineT: 64, shadowColor: C.cyan, shadowT: 92 });
    s.addText(txt, { x, y: y + 0.22, w: 1.22, h: 0.14, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 8.2, color: "D7F8FF" });
  });
  s.addShape(ST.cube, { x: 10.95, y: 4.66, w: 0.88, h: 0.88, rotate: 20, fill: { color: C.blue, transparency: 18 }, line: { color: "8DD7FF", transparency: 55 }, shadow: { type: "outer", color: C.blue, opacity: 0.24, blur: 2, angle: 45, distance: 1.6 } });
  s.addShape(ST.diamond, { x: 9.7, y: 5.5, w: 0.52, h: 0.52, rotate: 15, fill: { color: C.cyan, transparency: 28 }, line: { color: C.cyan, transparency: 50 } });
  s.addShape(ST.donut, { x: 11.9, y: 0.95, w: 0.74, h: 0.74, rotate: -10, fill: { color: "FFFFFF", transparency: 88 }, line: { color: C.cyan, transparency: 35 } });
  card(s, 0.88, 4.65, 6.55, 1.44, { fill: "FFFFFF", transparency: 84, line: "91C8FF", lineT: 55, shadowColor: C.cyan, shadowT: 91 });
  s.addText("Team Members", { x: 1.16, y: 4.91, w: 1.55, h: 0.18, margin: 0, fontFace: "Aptos", bold: true, fontSize: 9.5, color: "D7F8FF" });
  s.addText("AJAY M (23TD0003)   SHAFI AHMED F (23TD0076)   VIDYASAAGAR M (23TD0091)", { x: 1.16, y: 5.27, w: 5.88, h: 0.20, margin: 0, fontFace: "Aptos", fontSize: 8.9, color: C.white, fit: "shrink" });
  s.addText("Guide: Dr. R. G. Suresh Kumar", { x: 1.16, y: 5.67, w: 3.4, h: 0.18, margin: 0, fontFace: "Aptos", fontSize: 8.9, color: "BBD0EA" });
  s.addText("Computer Science and Engineering | Rajiv Gandhi College of Engineering and Technology", { x: 0.86, y: 6.74, w: 8.2, h: 0.18, margin: 0, fontFace: "Aptos", fontSize: 8.8, color: "BBD0EA" });
  addNotes(s, ["Open with the product vision: a planning assistant that transforms vague ideas into structured project blueprints."]);
}

const slides = [
  ["Problem Statement", "Students and small teams lose time turning ideas into execution-ready plans.", ["Project ideas start vague and incomplete", "BRD/SRS writing is manual and inconsistent", "Planning tools do not understand project context", "Teams struggle to convert goals into tasks", "AI outputs often vanish after one prompt"], ["Unclear scope", "Rework", "Delayed execution"]],
  ["Motivation", "A planning-first assistant can shorten the gap between idea and implementation.", ["Final-year projects need fast clarity", "AI can create structured planning artifacts", "Modern teams expect product-grade workflows", "Reusable memory improves continuity", "Generated prompts help move into coding"], ["Plan", "Document", "Execute"]],
  ["Objectives", "Build a web assistant that creates reliable planning artifacts from a project idea.", ["Capture project intent through guided input", "Generate BRD, SRS, roadmap, to-do list, and prompts", "Store blueprint memory for reuse", "Support authenticated project workspaces", "Deliver a deployable SaaS-style prototype"], ["Structured", "Authenticated", "Deployable"]],
  ["Existing System & Limitations", "Current planning approaches are fragmented across documents, notes, and generic AI chats.", ["Manual templates take time", "Generic chatbots lack project memory", "Task trackers do not create specifications", "Documents and implementation prompts are separated", "Version continuity is weak"], ["Docs", "Chat", "Tasks"]],
];

function addProblemLike(idx, spec) {
  const [t, sub, bullets, chips] = spec;
  const s = pptx.addSlide();
  addBg(s);
  title(s, t, sub);
  card(s, 0.9, 1.85, 5.3, 3.75, { transparency: 2 });
  bulletList(s, bullets, 1.25, 2.33, 4.45, { size: 13.4, gap: 0.52 });
  s.addShape(ST.line, { x: 6.92, y: 2.05, w: 0, h: 3.4, line: { color: C.line, width: 1 } });
  chips.forEach((c, i) => {
    const y = 2.15 + i * 1.06;
    addIcon(s, i === 0 ? "spark" : i === 1 ? "doc" : "gear", 7.55, y, 0.55, i === 1 ? C.cyan : C.blue);
    s.addText(c, { x: 8.28, y: y + 0.14, w: 2.25, h: 0.22, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 15, color: C.navy });
    s.addShape(ST.line, { x: 10.62, y: y + 0.28, w: 1.0, h: 0, line: { color: i === 1 ? C.cyan : C.blue, width: 2, beginArrowType: "none", endArrowType: "triangle" } });
  });
  footer(s, idx);
  addNotes(s, [`Explain ${t.toLowerCase()} in about 25 seconds using the left bullets and right visual cues.`]);
}

function addProposedSolution() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  title(s, "Proposed Solution", "BuildFlow AI converts raw project ideas into reusable blueprints and implementation-ready outputs.", "dark");
  const center = { x: 4.82, y: 2.12, w: 3.7, h: 1.48 };
  card(s, center.x, center.y, center.w, center.h, { fill: "FFFFFF", transparency: 86, line: "8DD7FF", lineT: 50, shadowColor: C.cyan, shadowT: 90 });
  s.addText("BuildFlow AI Engine", { x: center.x + 0.36, y: center.y + 0.42, w: 3, h: 0.24, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 18, color: C.white });
  s.addText("context + generation + memory", { x: center.x + 0.36, y: center.y + 0.88, w: 3, h: 0.16, margin: 0, align: "center", fontFace: "Aptos", fontSize: 9.5, color: "BBD0EA" });
  const nodes = [
    ["Guided Input", 1.1, 2.1, "spark"], ["AI Planning", 1.35, 4.35, "gear"],
    ["Blueprint Memory", 9.9, 2.1, "db"], ["Documents", 9.65, 4.35, "doc"],
  ];
  nodes.forEach(([txt, x, y, icon]) => {
    card(s, x, y, 2.2, 0.82, { fill: "FFFFFF", transparency: 90, line: "8DD7FF", lineT: 60, shadowColor: C.blue, shadowT: 94 });
    addIcon(s, icon, x + 0.18, y + 0.16, 0.43, C.cyan, "FFFFFF");
    s.addText(txt, { x: x + 0.72, y: y + 0.27, w: 1.25, h: 0.16, margin: 0, fontFace: "Aptos", bold: true, fontSize: 9.2, color: C.white, fit: "shrink" });
    s.addShape(ST.line, { x: x < 5 ? x + 2.24 : center.x + center.w, y: y + 0.41, w: x < 5 ? center.x - x - 2.35 : x - center.x - center.w - 0.06, h: 0, line: { color: "63E3FF", width: 1.6, transparency: 10, endArrowType: x < 5 ? "triangle" : "none", beginArrowType: x < 5 ? "none" : "triangle" } });
  });
  footer(s, 6, "dark");
  addNotes(s, ["Position the solution as a connected planning system, not a one-off chatbot."]);
}

function addKeyFeatures() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Key Features", "A focused feature set for planning, memory, generation, and deployment.");
  const items = [
    ["AI Blueprint", "Turns idea details into structured project context", "spark"],
    ["BRD and SRS", "Generates academic-ready planning documents", "doc"],
    ["Roadmap", "Creates phases, milestones, and implementation order", "gear"],
    ["To-Do List", "Breaks work into actionable tasks", "task"],
    ["Prompts", "Produces implementation prompts for coding support", "ai"],
    ["Project Memory", "Stores and reuses blueprint context", "db"],
  ];
  items.forEach(([h, b, ic], i) => {
    const x = 0.9 + (i % 3) * 4.05;
    const y = 1.92 + Math.floor(i / 3) * 2.0;
    card(s, x, y, 3.35, 1.35, { transparency: 0 });
    addIcon(s, ic, x + 0.25, y + 0.28, 0.55, i % 2 ? C.cyan : C.blue);
    s.addText(h, { x: x + 0.95, y: y + 0.28, w: 1.95, h: 0.22, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 13.4, color: C.navy, fit: "shrink" });
    s.addText(b, { x: x + 0.95, y: y + 0.7, w: 2.0, h: 0.38, margin: 0, fontFace: "Aptos", fontSize: 8.9, color: C.slate, fit: "shrink" });
  });
  footer(s, 7);
  addNotes(s, ["Walk through the features as a system: input, intelligence, artifacts, and persistent memory."]);
}

function addArchitecture() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "System Architecture", "Frontend, backend, AI gateway, and Firebase services form a modular SaaS architecture.");
  placeholder(s, 3.0, 1.82, 7.25, 4.55, "SYSTEM ARCHITECTURE DIAGRAM", "Insert final architecture diagram here");
  const left = [["React + Vite", "Tailwind UI"], ["Firebase Auth", "Secure sign-in"]];
  const right = [["Express API", "Generation orchestration"], ["Firestore", "Blueprint memory"], ["OpenRouter", "LLM responses"]];
  left.forEach((a, i) => {
    card(s, 0.82, 2.1 + i * 1.6, 1.75, 0.88, { transparency: 0 });
    addIcon(s, i ? "shield" : "ui", 1.02, 2.31 + i * 1.6, 0.36, i ? C.green : C.blue);
    s.addText(a[0], { x: 1.5, y: 2.26 + i * 1.6, w: 0.86, h: 0.14, margin: 0, fontFace: "Aptos", bold: true, fontSize: 7.8, color: C.navy, fit: "shrink" });
    s.addText(a[1], { x: 1.5, y: 2.52 + i * 1.6, w: 0.86, h: 0.13, margin: 0, fontFace: "Aptos", fontSize: 6.6, color: C.slate, fit: "shrink" });
  });
  right.forEach((a, i) => {
    card(s, 10.75, 1.75 + i * 1.36, 1.75, 0.84, { transparency: 0 });
    addIcon(s, i === 0 ? "gear" : i === 1 ? "db" : "cloud", 10.95, 1.96 + i * 1.36, 0.34, i === 2 ? C.cyan : C.blue);
    s.addText(a[0], { x: 11.4, y: 1.91 + i * 1.36, w: 0.84, h: 0.14, margin: 0, fontFace: "Aptos", bold: true, fontSize: 7.5, color: C.navy, fit: "shrink" });
    s.addText(a[1], { x: 11.4, y: 2.15 + i * 1.36, w: 0.84, h: 0.13, margin: 0, fontFace: "Aptos", fontSize: 6.4, color: C.slate, fit: "shrink" });
  });
  footer(s, 8);
  addNotes(s, ["Use this slide with the final system architecture diagram during review."]);
}

function addWorkflow() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  title(s, "Workflow", "A motion-inspired timeline from raw idea to review-ready planning output.", "dark");
  const steps = [
    ["01", "Enter idea", "Project goal, domain, features"],
    ["02", "Refine context", "AI builds blueprint memory"],
    ["03", "Generate docs", "BRD, SRS, roadmap"],
    ["04", "Plan tasks", "To-do list with order"],
    ["05", "Implement", "Prompts and deployment flow"],
  ];
  s.addShape(ST.line, { x: 1.0, y: 3.65, w: 11.25, h: 0, line: { color: "3B82F6", width: 3, transparency: 20, endArrowType: "triangle" } });
  steps.forEach(([n, h, b], i) => {
    const x = 0.94 + i * 2.42;
    s.addShape(ST.ellipse, { x, y: 3.25, w: 0.8, h: 0.8, fill: { color: i % 2 ? C.cyan : C.blue, transparency: 0 }, line: { color: "D7F8FF", transparency: 15 }, shadow: { type: "outer", color: i % 2 ? C.cyan : C.blue, opacity: 0.25, blur: 2, angle: 45, distance: 1 } });
    s.addText(n, { x, y: 3.51, w: 0.8, h: 0.14, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 8, color: C.white });
    s.addText(h, { x: x - 0.44, y: i % 2 ? 4.33 : 2.45, w: 1.7, h: 0.2, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 11.5, color: C.white, fit: "shrink" });
    s.addText(b, { x: x - 0.58, y: i % 2 ? 4.67 : 2.78, w: 2.0, h: 0.32, margin: 0, align: "center", fontFace: "Aptos", fontSize: 8.2, color: "BBD0EA", fit: "shrink" });
  });
  label(s, "ANIMATED HORIZONTAL TIMELINE", 5.15, 6.04, 2.95, "0B2448", "A7F3FF");
  footer(s, 9, "dark");
  addNotes(s, ["Describe the timeline as the primary demo flow."]);
}

function addTechStack() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Technology Stack", "A modern full-stack implementation optimized for speed, security, and deployment.");
  const stack = [
    ["React.js", "Frontend"], ["Vite", "Build tool"], ["Tailwind CSS", "UI styling"], ["Node.js", "Runtime"],
    ["Express.js", "API layer"], ["Firebase Auth", "Authentication"], ["Firestore", "Database"], ["OpenRouter", "AI gateway"],
    ["Vercel", "Frontend deploy"], ["Render", "Backend deploy"],
  ];
  stack.forEach(([name, role], i) => {
    const x = 0.9 + (i % 5) * 2.48;
    const y = 1.9 + Math.floor(i / 5) * 1.8;
    card(s, x, y, 1.95, 1.2, { transparency: 0 });
    addIcon(s, role.includes("AI") ? "spark" : role.includes("Database") ? "db" : role.includes("Auth") ? "shield" : role.includes("deploy") ? "cloud" : "code", x + 0.72, y + 0.16, 0.48, i % 3 === 0 ? C.cyan : C.blue);
    s.addText(name, { x: x + 0.16, y: y + 0.72, w: 1.64, h: 0.16, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 9.4, color: C.navy, fit: "shrink" });
    s.addText(role, { x: x + 0.16, y: y + 0.96, w: 1.64, h: 0.13, margin: 0, align: "center", fontFace: "Aptos", fontSize: 6.8, color: C.slate, fit: "shrink" });
  });
  footer(s, 10);
  addNotes(s, ["Explain the stack by layers: client, server, storage, AI, hosting."]);
}

function addModules() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Modules", "The system is divided into focused modules for maintainability.");
  const mods = [
    ["Authentication", "Firebase sign-in and protected access", "shield"],
    ["Project Input", "Collects goals, domain, features, constraints", "ui"],
    ["AI Generation", "Orchestrates model prompts and responses", "spark"],
    ["Document Output", "Formats BRD, SRS, roadmap, tasks", "doc"],
    ["Blueprint Memory", "Stores project context in Firestore", "db"],
  ];
  mods.forEach(([h, b, ic], i) => {
    const y = 1.72 + i * 0.95;
    addIcon(s, ic, 1.12, y, 0.42, i % 2 ? C.cyan : C.blue);
    s.addText(h, { x: 1.75, y: y + 0.04, w: 2.1, h: 0.18, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 12.2, color: C.navy, fit: "shrink" });
    s.addText(b, { x: 4.05, y: y + 0.05, w: 5.7, h: 0.16, margin: 0, fontFace: "Aptos", fontSize: 10, color: C.slate, fit: "shrink" });
    s.addShape(ST.line, { x: 1.75, y: y + 0.48, w: 9.8, h: 0, line: { color: "D8E2F0", width: 0.7 } });
  });
  card(s, 10.55, 1.9, 1.9, 3.88, { transparency: 0 });
  s.addText("Modular design keeps review, testing, and future upgrades simple.", { x: 10.88, y: 2.34, w: 1.22, h: 2.2, margin: 0, align: "center", valign: "mid", fontFace: "Poppins SemiBold", bold: true, fontSize: 16, color: C.blue, fit: "shrink" });
  footer(s, 11);
  addNotes(s, ["Tie each module to implementation responsibilities."]);
}

function addAiStages() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  title(s, "AI Planning Stages", "The assistant moves from understanding to artifacts through staged reasoning.", "dark");
  const stages = [
    ["Understand", "Parse idea, scope, stakeholders"],
    ["Structure", "Create modules and deliverables"],
    ["Plan", "Roadmap, tasks, milestones"],
    ["Generate", "BRD, SRS, prompts"],
    ["Refine", "Store and reuse blueprint memory"],
  ];
  stages.forEach(([h, b], i) => {
    const x = 0.92 + i * 2.48;
    card(s, x, 2.25 + (i % 2) * 0.42, 1.92, 2.25, { fill: "FFFFFF", transparency: 88, line: "8DD7FF", lineT: 60, shadowColor: i % 2 ? C.cyan : C.blue, shadowT: 92 });
    s.addText(String(i + 1), { x: x + 0.2, y: 2.52 + (i % 2) * 0.42, w: 0.42, h: 0.28, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 20, color: i % 2 ? C.cyan : C.blue });
    s.addText(h, { x: x + 0.24, y: 3.1 + (i % 2) * 0.42, w: 1.42, h: 0.22, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 13.5, color: C.white, fit: "shrink" });
    s.addText(b, { x: x + 0.24, y: 3.55 + (i % 2) * 0.42, w: 1.36, h: 0.56, margin: 0, fontFace: "Aptos", fontSize: 8.2, color: "BBD0EA", fit: "shrink" });
  });
  footer(s, 12, "dark");
  addNotes(s, ["Explain staged generation as the reason outputs are more consistent than a generic chat answer."]);
}

function addBlueprintMemory() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Blueprint Memory", "Stored context lets every generated output refer to the same project blueprint.");
  card(s, 0.95, 1.75, 4.05, 4.35, { transparency: 0 });
  s.addText("Memory Payload", { x: 1.32, y: 2.08, w: 2.25, h: 0.24, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 17, color: C.navy });
  bulletList(s, ["Project title and domain", "Problem and objective", "Core features", "Tech stack choices", "Generated artifact history"], 1.38, 2.7, 3.2, { size: 12.4, gap: 0.52 });
  s.addShape(ST.chevron, { x: 5.62, y: 3.05, w: 1.2, h: 0.82, fill: { color: C.blue, transparency: 8 }, line: { color: C.blue, transparency: 100 } });
  card(s, 7.28, 1.75, 4.55, 4.35, { transparency: 0 });
  addIcon(s, "db", 8.98, 2.18, 0.82, C.cyan);
  s.addText("Firestore", { x: 8.14, y: 3.2, w: 2.55, h: 0.32, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 22, color: C.blue });
  s.addText("Persistent blueprint memory keeps future BRD, SRS, roadmap, and prompt outputs aligned.", { x: 7.85, y: 3.86, w: 3.25, h: 0.54, margin: 0, align: "center", fontFace: "Aptos", fontSize: 11.2, color: C.slate, fit: "shrink" });
  footer(s, 13);
  addNotes(s, ["Highlight continuity: the project remembers its planning state instead of starting from zero each time."]);
}

function addDocumentGeneration() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Document Generation", "BuildFlow AI produces review-friendly planning artifacts from one project blueprint.");
  const docs = [["BRD", "Business requirement framing"], ["SRS", "Functional and non-functional requirements"], ["Roadmap", "Milestones and implementation phases"], ["To-Do List", "Actionable execution checklist"], ["Prompts", "Coding-ready implementation guidance"]];
  docs.forEach(([h, b], i) => {
    const x = 0.92 + i * 2.42;
    card(s, x, 2.15, 1.86, 3.22, { transparency: 0 });
    addIcon(s, "doc", x + 0.62, 2.54, 0.58, i % 2 ? C.cyan : C.blue);
    s.addText(h, { x: x + 0.18, y: 3.3, w: 1.5, h: 0.22, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 13.6, color: C.navy, fit: "shrink" });
    s.addText(b, { x: x + 0.18, y: 3.83, w: 1.5, h: 0.62, margin: 0, align: "center", fontFace: "Aptos", fontSize: 8.5, color: C.slate, fit: "shrink" });
  });
  footer(s, 14);
  addNotes(s, ["Use this slide to list the generated outputs explicitly."]);
}

function addPromptGeneration() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  title(s, "Prompt Generation", "Implementation prompts convert planning decisions into developer-ready instructions.", "dark");
  card(s, 0.95, 1.78, 5.12, 4.35, { fill: "FFFFFF", transparency: 88, line: "8DD7FF", lineT: 60, shadowColor: C.cyan, shadowT: 92 });
  s.addText("Prompt Template", { x: 1.28, y: 2.12, w: 2.1, h: 0.22, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 15, color: C.white });
  const promptLines = ["Role: Senior full-stack engineer", "Context: BuildFlow AI blueprint", "Task: Implement selected module", "Constraints: React + Firebase + Express", "Output: Steps, files, and tests"];
  promptLines.forEach((ln, i) => {
    s.addText(ln, { x: 1.36, y: 2.72 + i * 0.46, w: 4.15, h: 0.17, margin: 0, fontFace: "Aptos", fontSize: 9.7, color: "D7F8FF", fit: "shrink" });
  });
  card(s, 7.05, 1.78, 4.9, 4.35, { fill: "FFFFFF", transparency: 90, line: "8DD7FF", lineT: 65, shadowColor: C.blue, shadowT: 92 });
  bulletList(s, ["Reduces implementation ambiguity", "Keeps AI coding aligned to scope", "Supports module-by-module progress", "Improves reproducibility", "Helps students explain decisions"], 7.55, 2.38, 3.7, { size: 12.3, gap: 0.5, color: C.white, dot: C.cyan });
  footer(s, 15, "dark");
  addNotes(s, ["Explain prompts as the bridge between planning and actual implementation."]);
}

function addComparison() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Competitive Comparison", "BuildFlow AI combines planning, memory, and academic deliverables in one workflow.");
  const x = 0.85, y = 1.75, w = 11.65;
  const cols = [2.7, 2.15, 2.15, 2.15, 2.5];
  const headers = ["Capability", "Manual Docs", "Generic Chat AI", "Task Trackers", "BuildFlow AI"];
  const rows = [
    ["Guided project planning", "Low", "Medium", "Low", "High"],
    ["BRD/SRS generation", "Manual", "Partial", "No", "Built-in"],
    ["Persistent blueprint memory", "No", "Weak", "Project notes", "Yes"],
    ["Implementation prompts", "No", "Generic", "No", "Contextual"],
    ["Student review fit", "Variable", "Variable", "Low", "Strong"],
  ];
  card(s, x, y, w, 4.65, { transparency: 0, line: "CFE1FF" });
  let cx = x;
  headers.forEach((h, i) => {
    s.addShape(ST.rect, { x: cx, y, w: cols[i], h: 0.55, fill: { color: i === 4 ? C.blue : "EAF2FF" }, line: { color: "D8E2F0", transparency: 15 } });
    s.addText(h, { x: cx + 0.12, y: y + 0.19, w: cols[i] - 0.24, h: 0.13, margin: 0, align: i === 0 ? "left" : "center", fontFace: "Aptos", bold: true, fontSize: 7.7, color: i === 4 ? C.white : C.navy, fit: "shrink" });
    cx += cols[i];
  });
  rows.forEach((r, ri) => {
    cx = x;
    r.forEach((cell, ci) => {
      const yy = y + 0.55 + ri * 0.72;
      s.addShape(ST.rect, { x: cx, y: yy, w: cols[ci], h: 0.72, fill: { color: ci === 4 ? "EFF6FF" : "FFFFFF", transparency: 0 }, line: { color: "D8E2F0", transparency: 25 } });
      s.addText(cell, { x: cx + 0.12, y: yy + 0.25, w: cols[ci] - 0.24, h: 0.13, margin: 0, align: ci === 0 ? "left" : "center", fontFace: "Aptos", bold: ci === 0 || ci === 4, fontSize: 7.9, color: ci === 4 ? C.blue : C.slate, fit: "shrink" });
      cx += cols[ci];
    });
  });
  footer(s, 16);
  addNotes(s, ["Emphasize that BuildFlow AI is not replacing existing tools, but connecting planning artifacts with memory and prompts."]);
}

function addTesting() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Testing & Validation", "Validation focuses on functionality, output quality, and deployment readiness.");
  const tests = [
    ["Authentication", "Sign-in, protected routes, logout"],
    ["API Flow", "Request validation and response handling"],
    ["Firestore", "Create, read, and update blueprint data"],
    ["AI Output", "Artifact relevance and formatting"],
    ["Deployment", "Frontend and backend hosted paths"],
  ];
  tests.forEach(([h, b], i) => {
    const x = i < 3 ? 1.05 + i * 3.7 : 2.9 + (i - 3) * 3.7;
    const y = i < 3 ? 2.0 : 4.1;
    card(s, x, y, 2.85, 1.28, { transparency: 0 });
    addIcon(s, i === 0 ? "shield" : i === 2 ? "db" : i === 3 ? "spark" : "gear", x + 0.25, y + 0.28, 0.5, i % 2 ? C.cyan : C.blue);
    s.addText(h, { x: x + 0.9, y: y + 0.27, w: 1.55, h: 0.18, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 11.5, color: C.navy, fit: "shrink" });
    s.addText(b, { x: x + 0.9, y: y + 0.65, w: 1.55, h: 0.32, margin: 0, fontFace: "Aptos", fontSize: 8.4, color: C.slate, fit: "shrink" });
  });
  footer(s, 17);
  addNotes(s, ["Summarize testing as a validation plan. Replace with actual results if available."]);
}

function addScreenshots() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Product Screenshots", "Drop final screenshots into the device mockups for the demo section.");
  card(s, 0.85, 1.75, 7.15, 4.7, { transparency: 0 });
  s.addShape(ST.roundRect, { x: 1.25, y: 2.1, w: 6.35, h: 3.72, rectRadius: 0.08, fill: { color: "0F172A", transparency: 0 }, line: { color: "334155", transparency: 0 } });
  placeholder(s, 1.48, 2.42, 5.88, 3.06, "APPLICATION SCREENSHOT", "Laptop mockup placeholder");
  s.addShape(ST.rect, { x: 3.65, y: 5.86, w: 1.55, h: 0.18, fill: { color: "334155" }, line: { color: "334155", transparency: 100 } });
  card(s, 8.65, 2.04, 3.45, 4.15, { transparency: 0 });
  s.addShape(ST.roundRect, { x: 9.15, y: 2.46, w: 2.45, h: 3.22, rectRadius: 0.16, fill: { color: "0F172A" }, line: { color: "334155" } });
  placeholder(s, 9.32, 2.78, 2.12, 2.58, "MOBILE / TABLET VIEW", "Device placeholder");
  footer(s, 18);
  addNotes(s, ["Replace placeholders with real screenshots: dashboard, generated BRD/SRS, and prompt generation."]);
}

function addResults() {
  const s = pptx.addSlide();
  addBg(s);
  title(s, "Results & Benefits", "The prototype reduces planning friction and improves review clarity.");
  bigNumber(s, "01", "Faster project planning", 1.1, 2.05);
  bigNumber(s, "02", "Consistent academic artifacts", 1.1, 3.18, C.cyan);
  bigNumber(s, "03", "Reusable project context", 1.1, 4.31);
  card(s, 6.45, 1.78, 5.55, 4.55, { transparency: 0 });
  bulletList(s, ["BRD, SRS, roadmap, to-do list, and prompts generated from one blueprint", "Authentication and memory create a project workspace", "Deployment-ready architecture supports live demo", "Students can explain both planning and implementation decisions"], 6.92, 2.42, 4.35, { size: 12.4, gap: 0.6 });
  footer(s, 19);
  addNotes(s, ["Present this as expected/achieved benefits, depending on demo readiness."]);
}

function addFuture() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  title(s, "Future Enhancements", "The assistant can evolve from planning generator into a complete project execution companion.", "dark");
  const items = [
    ["Export to DOCX/PDF", "Downloadable formatted deliverables"],
    ["Team Collaboration", "Shared workspaces and comments"],
    ["Version History", "Compare blueprint changes over time"],
    ["AI Diagram Builder", "Auto-generate architecture and workflows"],
    ["Task Sync", "Push tasks to external trackers"],
  ];
  items.forEach(([h, b], i) => {
    const x = 1.05 + (i % 3) * 3.75;
    const y = 2.0 + Math.floor(i / 3) * 1.78;
    card(s, x, y, 2.95, 1.15, { fill: "FFFFFF", transparency: 88, line: "8DD7FF", lineT: 60, shadowColor: i % 2 ? C.cyan : C.blue, shadowT: 93 });
    s.addText(h, { x: x + 0.28, y: y + 0.24, w: 2.25, h: 0.18, margin: 0, fontFace: "Poppins SemiBold", bold: true, fontSize: 11.2, color: C.white, fit: "shrink" });
    s.addText(b, { x: x + 0.28, y: y + 0.63, w: 2.25, h: 0.22, margin: 0, fontFace: "Aptos", fontSize: 8.2, color: "BBD0EA", fit: "shrink" });
  });
  footer(s, 20, "dark");
  addNotes(s, ["Pick two future enhancements to discuss if time is short."]);
}

function addConclusion() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  s.addText("BuildFlow AI turns ideas into execution-ready project plans.", {
    x: 1.12, y: 2.18, w: 10.95, h: 1.16, margin: 0,
    align: "center", fontFace: "Poppins SemiBold", bold: true,
    fontSize: 34, color: C.white, fit: "shrink",
    shadow: { type: "outer", color: C.cyan, opacity: 0.35, blur: 2, angle: 45, distance: 1 },
  });
  s.addText("A SaaS-style assistant for planning, documenting, remembering, and prompting final-year project work.", {
    x: 2.15, y: 3.72, w: 8.95, h: 0.38, margin: 0,
    align: "center", fontFace: "Aptos", fontSize: 15, color: "BBD0EA",
    fit: "shrink",
  });
  label(s, "CONCLUSION", 5.45, 1.44, 2.25, "0B2448", "A7F3FF");
  footer(s, 21, "dark");
  addNotes(s, ["Land the impact statement and transition to demo/questions."]);
}

function addThankYou() {
  const s = pptx.addSlide();
  addBg(s, "dark");
  s.addText("Thank You", { x: 2.45, y: 1.68, w: 8.45, h: 0.76, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 46, color: C.white, fit: "shrink", shadow: { type: "outer", color: C.cyan, opacity: 0.38, blur: 2, angle: 45, distance: 1 } });
  s.addText("Questions?", { x: 4.78, y: 2.75, w: 3.75, h: 0.42, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 21, color: "BBD0EA" });
  card(s, 2.1, 4.35, 2.0, 1.7, { fill: "FFFFFF", transparency: 88, line: "8DD7FF", lineT: 55, shadowColor: C.cyan, shadowT: 92 });
  placeholder(s, 2.42, 4.62, 1.36, 1.12, "QR CODE", "Insert QR");
  card(s, 5.05, 4.35, 6.2, 1.7, { fill: "FFFFFF", transparency: 88, line: "8DD7FF", lineT: 55, shadowColor: C.blue, shadowT: 92 });
  s.addText("LIVE DEMO URL", { x: 5.55, y: 4.75, w: 5.2, h: 0.16, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 9, color: C.cyan });
  s.addText("https://your-buildflow-ai-deployment-url", { x: 5.55, y: 5.25, w: 5.2, h: 0.2, margin: 0, align: "center", fontFace: "Aptos", fontSize: 12, color: C.white, fit: "shrink" });
  s.addText("AJAY M | SHAFI AHMED F | VIDYASAAGAR M", { x: 3.2, y: 6.78, w: 6.9, h: 0.18, margin: 0, align: "center", fontFace: "Aptos", fontSize: 8.8, color: "BBD0EA" });
  addNotes(s, ["Close with the demo URL and QR code once available."]);
}

addCover();
slides.forEach((spec, i) => addProblemLike(i + 2, spec));
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
addFuture();
addConclusion();
addThankYou();

async function addTransitions(pptxPath) {
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  const effects = ["fade", "push", "fade", "wipe", "fade", "push", "fade", "wipe", "push", "fade", "wipe", "fade", "push", "fade", "wipe", "fade", "push", "fade", "wipe", "fade", "push", "fade"];
  for (let i = 1; i <= 22; i++) {
    const file = `ppt/slides/slide${i}.xml`;
    let xml = await zip.file(file).async("string");
    const animatedIds = [...xml.matchAll(/<p:cNvPr id="(\d+)" name="Text \d+"/g)]
      .slice(0, 3)
      .map((m) => m[1]);
    const timing = animatedIds.length ? buildFadeTiming(animatedIds) : "";
    const transition = effects[i - 1] === "push"
      ? '<p:transition spd="med"><p:push dir="l"/></p:transition>'
      : effects[i - 1] === "wipe"
        ? '<p:transition spd="med"><p:wipe dir="l"/></p:transition>'
        : '<p:transition spd="med"><p:fade/></p:transition>';
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/, "");
    xml = xml.replace(/<p:timing>[\s\S]*?<\/p:timing>/, "");
    xml = xml.replace("</p:sld>", `${transition}${timing}</p:sld>`);
    zip.file(file, xml);
  }
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await fs.writeFile(pptxPath, buf);
}

function buildFadeTiming(spids) {
  let id = 10;
  const effects = spids.map((spid, idx) => {
    const delay = idx === 0 ? 0 : 160;
    const ids = [id++, id++, id++, id++];
    return `<p:par><p:cTn id="${ids[0]}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${ids[1]}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="clickEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${ids[2]}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${ids[3]}" dur="500" fill="hold"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
  }).join("");
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${effects}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
}

async function renderPreviews(pptxPath) {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  const imported = await PresentationFile.importPptx(await FileBlob.load(pptxPath));
  const count = imported.slides.count;
  const previewPaths = [];
  for (let i = 0; i < count; i++) {
    const slide = imported.slides.getItem(i);
    const png = await imported.export({ format: "png", slide });
    const out = path.join(PREVIEW_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await fs.writeFile(out, Buffer.from(await png.arrayBuffer()));
    previewPaths.push(out);
  }
  let inspectSummary = null;
  try {
    inspectSummary = imported.inspect ? await imported.inspect({}) : null;
  } catch (err) {
    inspectSummary = { error: String(err?.message || err) };
  }
  await fs.writeFile(QA_JSON, JSON.stringify({ slideCount: count, previewPaths, inspectSummary }, null, 2));
  return { count, previewPaths };
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.mkdir("scratch", { recursive: true });
await pptx.writeFile({ fileName: OUT, compression: true });
await addTransitions(OUT);
const render = await renderPreviews(OUT);

console.log(JSON.stringify({
  pptx: OUT,
  slideCount: render.count,
  previewDir: PREVIEW_DIR,
  qaJson: QA_JSON,
}, null, 2));
