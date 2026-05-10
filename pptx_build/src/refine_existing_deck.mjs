import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const DECK = path.resolve("output/BuildFlow_AI_Project_Planning_Assistant.pptx");
const BACKUP = path.resolve("scratch/BuildFlow_AI_Project_Planning_Assistant.before-refine.pptx");
const TEMP_TITLE = path.resolve("scratch/refined-title.pptx");
const TEMP_CLOSE = path.resolve("scratch/refined-close.pptx");
const PREVIEW_DIR = path.resolve("scratch/previews");
const QA_JSON = path.resolve("scratch/refine-qa-report.json");
const EMU = 914400;

const C = {
  blue: "2563EB",
  indigo: "4F46E5",
  cyan: "06B6D4",
  navy: "0F172A",
  white: "FFFFFF",
  slate: "64748B",
  light: "F8FAFC",
};

function newDeck() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });
  pptx.author = "BuildFlow AI Team";
  pptx.company = "Rajiv Gandhi College of Engineering and Technology";
  pptx.subject = "BuildFlow AI refined slide";
  pptx.title = "BuildFlow AI - AI-Based Project Planning Assistant";
  pptx.theme = {
    headFontFace: "Poppins SemiBold",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };
  return pptx;
}

function gradientHero(slide, ST) {
  slide.background = { color: C.blue };
  const stops = [
    ["2563EB", 0], ["285FEB", 0.95], ["3159EA", 1.9], ["3B52E8", 2.85],
    ["444CE6", 3.8], ["4B48E5", 4.75], ["4F46E5", 5.7],
  ];
  stops.forEach(([color, x]) => {
    slide.addShape(ST.rect, { x, y: 0, w: 1.95, h: 7.5, fill: { color, transparency: 0 }, line: { color, transparency: 100 } });
  });
  slide.addShape(ST.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: "08111F", transparency: 38 }, line: { color: "08111F", transparency: 100 } });
  for (let x = 0.4; x < 13.2; x += 0.8) slide.addShape(ST.line, { x, y: 0, w: 0, h: 7.5, line: { color: "FFFFFF", transparency: 93, width: 0.35 } });
  for (let y = 0.35; y < 7.4; y += 0.8) slide.addShape(ST.line, { x: 0, y, w: 13.333, h: 0, line: { color: "FFFFFF", transparency: 93, width: 0.35 } });
  slide.addShape(ST.arc, { x: -1.15, y: -1.1, w: 5.4, h: 5.4, rotate: 15, fill: { color: "FFFFFF", transparency: 91 }, line: { color: "FFFFFF", transparency: 100 } });
  slide.addShape(ST.arc, { x: 8.9, y: 4.0, w: 5.7, h: 5.7, rotate: 210, fill: { color: C.cyan, transparency: 78 }, line: { color: C.cyan, transparency: 100 } });
}

function glass(slide, ST, x, y, w, h, t = 82) {
  slide.addShape(ST.roundRect, { x: x + 0.07, y: y + 0.08, w, h, rectRadius: 0.12, fill: { color: "0B1020", transparency: 88 }, line: { color: "0B1020", transparency: 100 } });
  slide.addShape(ST.roundRect, {
    x, y, w, h, rectRadius: 0.16,
    fill: { color: "FFFFFF", transparency: t },
    line: { color: "BFE7FF", transparency: 54, width: 1 },
    shadow: { type: "outer", color: "071122", opacity: 0.22, blur: 2.5, angle: 45, distance: 1.4 },
  });
}

function iconNode(slide, ST, x, y, label, active = false) {
  slide.addShape(ST.ellipse, { x, y, w: 0.48, h: 0.48, fill: { color: active ? C.cyan : "FFFFFF", transparency: active ? 0 : 83 }, line: { color: "A7F3FF", transparency: 25, width: 1 } });
  slide.addText(label, { x, y: y + 0.17, w: 0.48, h: 0.09, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 5.5, color: active ? C.white : "D7F8FF" });
}

async function makeTitleSlide() {
  const pptx = newDeck();
  const ST = pptx.ShapeType;
  const slide = pptx.addSlide();
  gradientHero(slide, ST);

  slide.addText("BuildFlow AI", {
    x: 0.82, y: 1.08, w: 6.4, h: 0.7, margin: 0,
    fontFace: "Poppins SemiBold", bold: true, fontSize: 51,
    color: C.white, fit: "shrink",
    shadow: { type: "outer", color: C.cyan, opacity: 0.46, blur: 2.2, angle: 45, distance: 1.1 },
  });
  slide.addText("AI-Based Project Planning Assistant", {
    x: 0.86, y: 2.0, w: 5.9, h: 0.33, margin: 0,
    fontFace: "Aptos", fontSize: 17.5, color: "E0F2FE", fit: "shrink",
  });
  slide.addShape(ST.line, { x: 0.88, y: 2.58, w: 1.42, h: 0, line: { color: C.cyan, width: 3.2 } });
  slide.addText("Final-Year Mini Project Review", {
    x: 0.88, y: 2.77, w: 2.65, h: 0.18, margin: 0,
    fontFace: "Aptos", bold: true, fontSize: 10.2, color: "A7F3FF",
  });

  glass(slide, ST, 0.86, 4.34, 6.62, 1.65, 84);
  slide.addText("Team", { x: 1.18, y: 4.66, w: 0.65, h: 0.16, margin: 0, fontFace: "Aptos", bold: true, fontSize: 9.2, color: "A7F3FF" });
  slide.addText("AJAY M (23TD0003)   SHAFI AHMED F (23TD0076)   VIDYASAAGAR M (23TD0091)", { x: 1.18, y: 5.02, w: 5.9, h: 0.17, margin: 0, fontFace: "Aptos", fontSize: 8.3, color: C.white, fit: "shrink" });
  slide.addText("Guide: Dr. R. G. Suresh Kumar", { x: 1.18, y: 5.36, w: 3.45, h: 0.15, margin: 0, fontFace: "Aptos", fontSize: 8.2, color: "D7F8FF" });
  slide.addText("Department of Computer Science and Engineering", { x: 4.52, y: 5.36, w: 2.55, h: 0.15, margin: 0, fontFace: "Aptos", fontSize: 8.2, color: "D7F8FF", fit: "shrink" });
  slide.addText("Rajiv Gandhi College of Engineering and Technology", { x: 1.18, y: 5.68, w: 5.9, h: 0.15, margin: 0, fontFace: "Aptos", fontSize: 8.2, color: "D7F8FF", fit: "shrink" });

  // Right-side AI/network product illustration, built from editable PPT shapes.
  glass(slide, ST, 8.05, 1.18, 3.95, 3.95, 90);
  slide.addShape(ST.ellipse, { x: 9.18, y: 2.08, w: 1.66, h: 1.66, fill: { color: "FFFFFF", transparency: 91 }, line: { color: C.cyan, transparency: 25, width: 1.4 } });
  slide.addShape(ST.ellipse, { x: 9.58, y: 2.48, w: 0.86, h: 0.86, fill: { color: C.cyan, transparency: 6 }, line: { color: "A7F3FF", transparency: 20, width: 1 } });
  const nodes = [
    [8.72, 1.75, "BRD", true], [10.82, 1.72, "SRS", false], [8.62, 3.62, "MAP", false],
    [10.95, 3.58, "AI", true], [9.74, 4.32, "TASK", false],
  ];
  nodes.forEach(([x, y, l, a]) => iconNode(slide, ST, x, y, l, a));
  [[8.96,1.99,9.58,2.58],[10.82,1.96,10.42,2.58],[8.86,3.62,9.58,3.14],[10.95,3.58,10.42,3.12],[9.98,4.32,10.05,3.34]].forEach(([x1,y1,x2,y2]) => {
    slide.addShape(ST.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: "A7F3FF", transparency: 35, width: 1.1 } });
  });
  slide.addShape(ST.cube, { x: 11.42, y: 5.18, w: 0.72, h: 0.72, rotate: 18, fill: { color: C.cyan, transparency: 22 }, line: { color: "A7F3FF", transparency: 40 } });
  slide.addShape(ST.diamond, { x: 8.58, y: 5.44, w: 0.48, h: 0.48, rotate: 16, fill: { color: "FFFFFF", transparency: 82 }, line: { color: "A7F3FF", transparency: 45 } });
  slide.addText("Blueprints to execution in one AI workflow", { x: 8.3, y: 5.56, w: 3.4, h: 0.18, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 8.8, color: "D7F8FF", fit: "shrink" });
  await pptx.writeFile({ fileName: TEMP_TITLE, compression: true });
}

async function makeClosingSlide() {
  const pptx = newDeck();
  const ST = pptx.ShapeType;
  const slide = pptx.addSlide();
  gradientHero(slide, ST);
  slide.addText("Thank You", {
    x: 2.0, y: 1.4, w: 9.3, h: 0.72, margin: 0, align: "center",
    fontFace: "Poppins SemiBold", bold: true, fontSize: 50, color: C.white, fit: "shrink",
    shadow: { type: "outer", color: C.cyan, opacity: 0.42, blur: 2.2, angle: 45, distance: 1.1 },
  });
  slide.addText("Questions?", { x: 4.85, y: 2.38, w: 3.65, h: 0.34, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 22, color: "D7F8FF" });
  glass(slide, ST, 2.12, 4.18, 2.06, 1.72, 84);
  slide.addShape(ST.roundRect, { x: 2.48, y: 4.48, w: 1.34, h: 1.12, rectRadius: 0.08, fill: { color: C.light, transparency: 0 }, line: { color: "A9C8F8", width: 1, dash: "dash" } });
  slide.addText("QR CODE", { x: 2.48, y: 4.95, w: 1.34, h: 0.12, margin: 0, align: "center", fontFace: "Poppins SemiBold", bold: true, fontSize: 8.5, color: C.blue });
  slide.addText("Insert QR", { x: 2.48, y: 5.21, w: 1.34, h: 0.09, margin: 0, align: "center", fontFace: "Aptos", fontSize: 6.4, color: C.slate });
  glass(slide, ST, 5.05, 4.18, 6.2, 1.72, 86);
  slide.addText("DEPLOYMENT URL", { x: 5.58, y: 4.64, w: 5.15, h: 0.14, margin: 0, align: "center", fontFace: "Aptos", bold: true, fontSize: 8.8, color: "A7F3FF" });
  slide.addText("https://your-buildflow-ai-deployment-url", { x: 5.58, y: 5.14, w: 5.15, h: 0.18, margin: 0, align: "center", fontFace: "Aptos", fontSize: 12.2, color: C.white, fit: "shrink" });
  slide.addText("AJAY M | SHAFI AHMED F | VIDYASAAGAR M", { x: 3.0, y: 6.72, w: 7.35, h: 0.16, margin: 0, align: "center", fontFace: "Aptos", fontSize: 8.6, color: "E0F2FE" });
  await pptx.writeFile({ fileName: TEMP_CLOSE, compression: true });
}

function emu(v) {
  return Math.round(v * EMU);
}

function shapeXml(id, name, prst, x, y, w, h, fill, alpha = 100000, rot = 0) {
  const rotAttr = rot ? ` rot="${Math.round(rot * 60000)}"` : "";
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm${rotAttr}><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${prst}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"><a:alpha val="${alpha}"/></a:srgbClr></a:solidFill><a:ln w="6350"><a:solidFill><a:srgbClr val="${fill}"><a:alpha val="0"/></a:srgbClr></a:solidFill></a:ln></p:spPr></p:sp>`;
}

function textXml(id, name, text, x, y, w, h, color, size = 780, bold = false) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" anchor="ctr"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="${size}"${bold ? ' b="1"' : ""}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Aptos"/></a:rPr><a:t>${escapeXml(text)}</a:t></a:r><a:endParaRPr lang="en-US" sz="${size}"/></a:p></p:txBody></p:sp>`;
}

function escapeXml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function maxShapeId(xml) {
  return Math.max(...[...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map((m) => Number(m[1])), 1);
}

function injectBrandLayer(xml, slideNo) {
  let id = maxShapeId(xml) + 1000;
  const dark = xml.includes('<a:srgbClr val="0F172A"') || xml.includes('<a:srgbClr val="08111F"');
  const pieces = [];
  pieces.push(shapeXml(id++, `Brand glow ${slideNo}`, "arc", -0.7, -0.62, 3.5, 3.5, dark ? "4F46E5" : "DDEBFF", dark ? 20000 : 52000, 12));
  pieces.push(shapeXml(id++, `Brand cyan wash ${slideNo}`, "arc", 10.2, 5.08, 2.85, 2.85, "06B6D4", dark ? 20000 : 42000, 208));
  pieces.push(shapeXml(id++, `Brand micro chip ${slideNo}`, "roundRect", 11.25, 0.36, 1.14, 0.26, dark ? "FFFFFF" : "EAF2FF", dark ? 13000 : 100000, 0));
  pieces.push(textXml(id++, `Brand chip text ${slideNo}`, "BuildFlow AI", 11.25, 0.42, 1.14, 0.08, dark ? "D7F8FF" : "2563EB", 560, true));
  return xml.replace("</p:grpSpPr>", `</p:grpSpPr>${pieces.join("")}`);
}

function buildTiming(spids, slideNo) {
  let id = 20;
  const filters = ["fade", "wipe(up)", "zoom", "fade"];
  const effects = spids.slice(0, 4).map((spid, idx) => {
    const delay = idx === 0 ? 0 : 140 + idx * 40;
    const filter = filters[(slideNo + idx) % filters.length];
    const ids = [id++, id++, id++, id++];
    return `<p:par><p:cTn id="${ids[0]}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${ids[1]}" presetID="${10 + idx}" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="clickEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${ids[2]}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="${filter}"><p:cBhvr><p:cTn id="${ids[3]}" dur="520" fill="hold"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
  }).join("");
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${effects}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
}

function transitionXml(slideNo) {
  const kind = ["fade", "push", "zoom", "wipe"][slideNo % 4];
  if (kind === "push") return '<p:transition spd="med"><p:push dir="l"/></p:transition>';
  if (kind === "zoom") return '<p:transition spd="med"><p:zoom dir="in"/></p:transition>';
  if (kind === "wipe") return '<p:transition spd="med"><p:wipe dir="l"/></p:transition>';
  return '<p:transition spd="med"><p:fade/></p:transition>';
}

async function getSingleSlideXml(pptxPath) {
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  return zip.file("ppt/slides/slide1.xml").async("string");
}

async function renderPreviews() {
  await fs.rm(PREVIEW_DIR, { recursive: true, force: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  const imported = await PresentationFile.importPptx(await FileBlob.load(DECK));
  const previewPaths = [];
  for (let i = 0; i < imported.slides.count; i++) {
    const slide = imported.slides.getItem(i);
    const png = await imported.export({ format: "png", slide });
    const out = path.join(PREVIEW_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await fs.writeFile(out, Buffer.from(await png.arrayBuffer()));
    previewPaths.push(out);
  }
  await fs.writeFile(QA_JSON, JSON.stringify({ slideCount: imported.slides.count, previewPaths }, null, 2));
  return { count: imported.slides.count, previewPaths };
}

async function main() {
  await fs.mkdir("scratch", { recursive: true });
  await fs.copyFile(DECK, BACKUP);
  await makeTitleSlide();
  await makeClosingSlide();

  const titleXml = await getSingleSlideXml(TEMP_TITLE);
  const closeXml = await getSingleSlideXml(TEMP_CLOSE);
  const zip = await JSZip.loadAsync(await fs.readFile(DECK));

  for (let i = 1; i <= 22; i++) {
    const file = `ppt/slides/slide${i}.xml`;
    let xml = i === 1 ? titleXml : i === 22 ? closeXml : await zip.file(file).async("string");
    if (i !== 1 && i !== 22) {
      xml = injectBrandLayer(xml, i);
    }
    const animatedIds = [...xml.matchAll(/<p:cNvPr id="(\d+)" name="Text \d+"/g)].map((m) => m[1]);
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, "");
    xml = xml.replace(/<p:timing>[\s\S]*?<\/p:timing>/g, "");
    xml = xml.replace("</p:sld>", `${transitionXml(i)}${buildTiming(animatedIds, i)}</p:sld>`);
    zip.file(file, xml);
  }

  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await fs.writeFile(DECK, buf);
  const render = await renderPreviews();
  console.log(JSON.stringify({ deck: DECK, backup: BACKUP, slideCount: render.count, previewDir: PREVIEW_DIR, qaJson: QA_JSON }, null, 2));
}

await main();
