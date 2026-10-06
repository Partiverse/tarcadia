#!/usr/bin/env node
/* board2godot.mjs — 三稿板手排字符矩阵 → Godot 资产全量迁移
 *
 * 输入（只读，不改稿板）：
 *   docs/pixel-characters.html  色板 PAL（35 键）
 *   docs/pixel-world.html       色板 SEASON_PALS（四季键名同构，×4 变体导出）
 *   docs/pixel-phenology.html   色板 SEASON_PALS（每候固定本季，按 ICONS[].season 绑定）
 *
 * 口径（与 .zcode/skills/pixel-audit/scripts/audit.cjs 同源并修正其一处）：
 *   - 数据段 = <script> 内 '/* ===== 渲染器' 锚之前；渲染段跳过
 *   - 数组名 = 数据段内 /const ([A-Z_0-9]+)\s*=\s*\[/g（audit 原正则 `=\[` 不容换行，
 *     漏数 world 五个换行声明的天气数组 W_RAIN_A/B、W_SNOW_A/B、W_FOG——本工具修正补齐）
 *   - 像素数组 = Array.isArray(arr) && arr.length>0 && typeof arr[0]==='string'
 *     （audit 同款判据，自动跳过 CAST、FACES_*、ICONS、TILES、TREES 等对象表）
 *
 * 硬性约束：
 *   ① 未登记色键 → exit 非 0，指明稿板/数组/行号/字符，绝不猜色（洋红兜底哲学：兜底只属于
 *      稿板渲染器的显示行为，不属于资产迁移；迁移产物中出现 #FF00FF 像素即失败）
 *   ② --verify：重解析→重导出到临时目录→与已导出文件逐字节比对＋全部导出 PNG 的
 *      #FF00FF 像素计数（必须为 0）＋帧数对 MANIFEST，任何出入 exit 非 0
 *   ③ 数据段全部像素数组一次迁完（默认模式=全量导出＋导出后自检）
 *
 * 用法：node tools/board2godot.mjs            # 全量导出＋自检
 *       node tools/board2godot.mjs --verify   # 只复核已导出产物，不写 game/assets
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import zlib from 'node:zlib';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ASSETS = path.join(ROOT, 'game', 'assets');
const VERIFY_ONLY = process.argv.includes('--verify');

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const BOARDS = [
  { key: 'characters', doc: 'docs/pixel-characters.html', out: 'sprites/characters', pal: 'PAL' },
  { key: 'world', doc: 'docs/pixel-world.html', out: 'sprites/world', pal: 'SEASON_PALS' },
  { key: 'phenology', doc: 'docs/pixel-phenology.html', out: 'sprites/phenology', pal: 'SEASON_PALS' },
];
const RENDERER_ANCHOR = '/* ===== 渲染器';
const NAME_RE = /const ([A-Z_0-9]+)\s*=\s*\[/g;

function fail(msg) {
  console.error('FAIL: ' + msg);
  process.exit(1);
}

/* ---------------- PNG 编解码（零依赖，RGBA8 / color type 6） ---------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function pngChunk(type, data) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([head, body, crc]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}
/* 解码（--verify 洋红计数用；本工具产出为 color type 6 / 8bit，支持 filter 0-4） */
function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) fail('PNG 签名不符');
  let off = 8, w = 0, h = 0;
  const idats = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 6) fail('PNG IHDR 非 RGBA8: ' + w + 'x' + h);
    } else if (type === 'IDAT') idats.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idats));
  const stride = w * 4;
  const out = Buffer.alloc(stride * h);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? out[y * stride + x - 4] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = y > 0 && x >= 4 ? out[(y - 1) * stride + x - 4] : 0;
      let v = row[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) v += paeth(a, b, c);
      out[y * stride + x] = v & 0xff;
    }
  }
  return { w, h, rgba: out };
}

/* ---------------- 稿板解析 ---------------- */

function boardData(b) {
  const html = fs.readFileSync(path.join(ROOT, b.doc), 'utf8');
  const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const cut = script.indexOf(RENDERER_ANCHOR);
  if (cut < 0) fail(b.key + ': 找不到渲染器锚');
  return script.slice(0, cut);
}

function parseBoard(b) {
  const data = boardData(b);
  const names = [...data.matchAll(NAME_RE)].map((m) => m[1]);
  const seen = new Set();
  for (const n of names) {
    if (seen.has(n)) fail(b.key + ': 数组名重复声明 ' + n);
    seen.add(n);
  }
  const body =
    data +
    '\n;return{V:{' + names.map((n) => n + ':(typeof ' + n + '==="undefined"?null:' + n + ')').join(',') +
    '},PAL:(typeof PAL==="undefined"?null:PAL),SP:(typeof SEASON_PALS==="undefined"?null:SEASON_PALS),' +
    'ICONS:(typeof ICONS==="undefined"?null:ICONS)};';
  let scope;
  try {
    scope = new Function(body)();
  } catch (e) {
    fail(b.key + ': 数据段求值失败: ' + e.message);
  }
  const pixel = [];
  for (const n of names) {
    const a = scope.V[n];
    if (Array.isArray(a) && a.length > 0 && typeof a[0] === 'string') pixel.push({ name: n, rows: a });
  }
  return { names, pixel, PAL: scope.PAL, SP: scope.SP, ICONS: scope.ICONS };
}

function hexToRGB(hex, where) {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) fail(where + ': 色值非 #RRGGBB「' + hex + '」——不猜色，拒绝导出');
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

/* rows × 色板 → RGBA Buffer；未登记色键在此硬失败（硬性要求①） */
function renderRGBA(rows, pal, label) {
  const w = rows[0].length, h = rows.length;
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    if (row.length !== w) fail(label + '[' + y + ']: 行宽 ' + row.length + ' != ' + w + '（锯齿矩阵，拒绝导出）');
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue; // '.'＝透明（phenology 语义＝留白透宣纸）
      const hex = Object.prototype.hasOwnProperty.call(pal, ch) ? pal[ch] : null;
      if (hex === null) fail(label + '[' + y + ']: 未登记色键 ' + JSON.stringify(ch) + '（x=' + x + '）——不猜色，拒绝导出');
      const [r, g, b] = hexToRGB(hex, label);
      const o = (y * w + x) * 4;
      buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = 255;
    }
  }
  return { w, h, buf };
}

function seasonPal(SP, season, label) {
  const p = SP && SP[season];
  if (!p) fail(label + ': SEASON_PALS 缺季 ' + season);
  const pal = { ...p };
  delete pal.name; // 季名非色键
  return pal;
}

/* 色板绑定：characters=PAL 单变体；world=四季×4；phenology=ICONS[].season 本季单变体 */
function bindPalettes(parsed, boardKey) {
  const { pixel, PAL, SP, ICONS } = parsed;
  if (boardKey === 'characters') {
    if (!PAL) fail('characters: 找不到 const PAL');
    return pixel.map((a) => ({ ...a, variants: [{ tag: null, pal: PAL, season: null }] }));
  }
  if (boardKey === 'world') {
    return pixel.map((a) => ({
      ...a,
      variants: SEASONS.map((s) => ({ tag: s, pal: seasonPal(SP, s, 'world/' + a.name), season: s })),
    }));
  }
  // phenology：rows 对象身份 → ICONS[].season
  if (!Array.isArray(ICONS)) fail('phenology: 找不到 ICONS 表（本季色板绑定源）');
  const byRows = new Map();
  for (const it of ICONS) if (it && it.rows && it.season) byRows.set(it.rows, it.season);
  return pixel.map((a) => {
    const season = byRows.get(a.rows);
    if (!season) fail('phenology/' + a.name + ': 未在 ICONS 登记本季色板——不猜季，拒绝导出');
    return { ...a, variants: [{ tag: null, pal: seasonPal(SP, season, 'phenology/' + a.name), season }] };
  });
}

/* ---------------- 导出计划 ---------------- */

function buildPlan() {
  const plan = { arrays: [], resources: [], counts: {} };
  for (const b of BOARDS) {
    const parsed = parseBoard(b);
    const bound = bindPalettes(parsed, b.key);
    plan.counts[b.key] = { pixel: bound.length, consts: parsed.names.length };
    for (const a of bound) {
      const w = a.rows[0].length, h = a.rows.length;
      const files = a.variants.map((v) => {
        const rel = b.out + '/' + a.name + (v.tag ? '_' + v.tag : '') + '.png';
        const label = b.key + '/' + a.name + (v.season ? '@' + v.season : '');
        const img = renderRGBA(a.rows, v.pal, label);
        return { rel, bytes: encodePNG(img.w, img.h, img.buf), season: v.season };
      });
      plan.arrays.push({ board: b.key, name: a.name, w, h, files, doc: b.doc });
    }
    if (b.key === 'world') {
      /* 16×16 数组 → 四季 atlas＋TileSet（TileSetAtlasSource，16×16 格） */
      const tiles = bound.filter((a) => a.rows[0].length === 16 && a.rows.length === 16);
      const COLS = 8;
      const rowsN = Math.ceil(tiles.length / COLS);
      for (const s of SEASONS) {
        const atlas = Buffer.alloc(COLS * 16 * rowsN * 16 * 4);
        tiles.forEach((t, i) => {
          const v = t.variants.find((x) => x.tag === s);
          const img = renderRGBA(t.rows, v.pal, 'world/atlas@' + s + '/' + t.name);
          const cx = (i % COLS) * 16, cy = Math.floor(i / COLS) * 16;
          for (let y = 0; y < 16; y++) {
            img.buf.copy(atlas, ((cy + y) * COLS * 16 + cx) * 4, y * 16 * 4, (y + 1) * 16 * 4);
          }
        });
        plan.resources.push({ rel: b.out + '/atlas_world_' + s + '.png', bytes: encodePNG(COLS * 16, rowsN * 16, atlas) });
        plan.resources.push({ rel: b.out + '/tileset_' + s + '.tres', bytes: Buffer.from(buildTilesetTres(tiles.length, COLS, s), 'utf8') });
      }
    }
  }
  /* SpriteFrames（每稿板一份）：家族 `_数字`（生长态）与 `_A/B/C`（工具三帧语法）≥2 成员
   * 分组为多帧动画；其余单帧（SIDE_OPEN_M/F/J 是三套骨骼腿段、非动画帧，按此规则排除） */
  for (const b of BOARDS) {
    const arrs = plan.arrays.filter((a) => a.board === b.key);
    const names = arrs.map((a) => a.name);
    const fam = new Map();
    for (const n of names) {
      const m = n.match(/^(.*)_(\d+|[A-Z])$/);
      if (m && (/^\d+$/.test(m[2]) || 'ABC'.includes(m[2]))) {
        if (!fam.has(m[1])) fam.set(m[1], []);
        fam.get(m[1]).push({ suf: m[2], name: n });
      }
    }
    const frameRel = (n) => {
      const a = arrs.find((x) => x.name === n);
      return (a.files.find((f) => f.season === null) || a.files[0]).rel;
    };
    const emitted = new Set();
    const anims = [];
    for (const n of names) {
      if (emitted.has(n)) continue;
      const m = n.match(/^(.*)_(\d+|[A-Z])$/);
      const group = m && (/^\d+$/.test(m[2]) || 'ABC'.includes(m[2])) ? fam.get(m[1]) : null;
      if (group && group.length >= 2 && !names.includes(m[1])) {
        group.sort((x, y) => (/^\d+$/.test(x.suf) && /^\d+$/.test(y.suf) ? Number(x.suf) - Number(y.suf) : x.suf < y.suf ? -1 : 1));
        anims.push({ name: m[1], frames: group.map((g) => g.name) });
        for (const g of group) emitted.add(g.name);
      } else {
        anims.push({ name: n, frames: [n] });
        emitted.add(n);
      }
    }
    plan.resources.push({ rel: b.out + '/' + b.key + '_spriteframes.tres', bytes: Buffer.from(buildSpriteFramesTres(anims, frameRel), 'utf8') });
  }
  return plan;
}

/* ---------------- Godot .tres 生成（Godot 4.x，format=3） ---------------- */

function buildSpriteFramesTres(anims, frameRel) {
  const texs = [];
  for (const a of anims) for (const f of a.frames) {
    const rel = frameRel(f);
    if (!texs.includes(rel)) texs.push(rel);
  }
  const L = [];
  L.push('[gd_resource type="SpriteFrames" load_steps=' + (texs.length + 1) + ' format=3]');
  L.push('');
  texs.forEach((rel, i) => L.push('[ext_resource type="Texture2D" path="res://assets/' + rel + '" id="' + (i + 1) + '"]'));
  L.push('');
  L.push('[resource]');
  L.push('animations = [' + anims.map((a) => {
    const frames = a.frames.map((f) => '{\n"duration": 1.0,\n"texture": ExtResource("' + (texs.indexOf(frameRel(f)) + 1) + '")\n}').join(', ');
    return '{\n"frames": [' + frames + '],\n"loop": true,\n"name": &"' + a.name + '",\n"speed": 5.0\n}';
  }).join(', ') + ']');
  L.push('');
  return L.join('\n');
}

function buildTilesetTres(tileCount, cols, season) {
  const L = [];
  L.push('[gd_resource type="TileSet" load_steps=3 format=3]');
  L.push('');
  L.push('[ext_resource type="Texture2D" path="res://assets/sprites/world/atlas_world_' + season + '.png" id="1"]');
  L.push('');
  L.push('[sub_resource type="TileSetAtlasSource" id="atlas_' + season + '"]');
  L.push('texture = ExtResource("1")');
  L.push('texture_region_size = Vector2i(16, 16)');
  for (let i = 0; i < tileCount; i++) L.push((i % cols) + ':' + Math.floor(i / cols) + '/0 = 0');
  L.push('');
  L.push('[resource]');
  L.push('tile_size = Vector2i(16, 16)');
  L.push('sources/0 = SubResource("atlas_' + season + '")');
  L.push('');
  return L.join('\n');
}

/* ---------------- MANIFEST ---------------- */

function buildManifest(plan, auditCounts) {
  const totalFrames = plan.arrays.reduce((s, a) => s + a.files.length, 0);
  const totalFiles = totalFrames + plan.resources.length + 1;
  const L = [];
  L.push('# game/assets/MANIFEST.md');
  L.push('');
  L.push('由 `tools/board2godot.mjs` 确定性导出，**勿手改**；重跑 `node tools/board2godot.mjs` 再生；`node tools/board2godot.mjs --verify` 复核（重解析→重导出到临时目录→与本目录逐字节比对＋全部 PNG 洋红 #FF00FF 计数＋帧数对本清单，任何出入 exit 非 0）。');
  L.push('');
  L.push('- 数据段口径：稿板 `<script>` 内 `/* ===== 渲染器` 锚之前、`const NAME=[…]` 且首元素为字符串（audit 同款判据；渲染段与 CAST/FACES_*/ICONS/TILES/TREES 等对象表跳过）。');
  L.push('- audit 最新输出（宽/行数/色键 PASS）：characters ' + auditCounts.characters + ' ＋ world ' + auditCounts.world + ' ＋ phenology ' + auditCounts.phenology + ' ＝ ' + (auditCounts.characters + auditCounts.world + auditCounts.phenology) + ' 个像素数组。');
  L.push('- 本清单实迁 ' + plan.arrays.length + ' 个数组＝' + totalFrames + ' 帧 PNG：world 较 audit 多 5 个（W_RAIN_A/B、W_SNOW_A/B、W_FOG——audit 原正则 `=\\[` 不容 `=` 与 `[` 间换行而漏数其换行声明，本工具修正补齐）。');
  L.push('- 未导出说明：characters 渲染段 `WALKROWS_M/F/J` 为 `withRows(体, 腿段)` 运行时合成帧非手排矩阵，行走动画由引擎以 `*_SIDE`＋`SIDE_OPEN_*` 同语义合成；world 渲染段 `AUTO_DEMO/AUTO_DEMO2` 为 autotile 演示家族掩码（键＝地块家族码非色板键）。均不属像素资产。');
  L.push('- 色板绑定：characters=`PAL`；world=`SEASON_PALS` 四季同构换色（每数组 4 帧 `_spring/_summer/_autumn/_winter`）；phenology=`ICONS[].season` 本季色板（`.`＝透明，即留白透宣纸）。');
  L.push('- 洋红哲学：未登记色键在导出期硬失败（exit 非 0、指明数组与字符、不猜色）；迁移产物中 #FF00FF 像素必须为 0（--verify 强制）。');
  L.push('');
  L.push('汇总：数组 ' + plan.arrays.length + ' ｜ 帧 PNG ' + totalFrames + ' ｜ 派生资源 ' + plan.resources.length + '（atlas×4＋TileSet×4＋SpriteFrames×3）｜ 文件合计 ' + totalFiles);
  L.push('');
  for (const b of BOARDS) {
    const arrs = plan.arrays.filter((a) => a.board === b.key);
    L.push('## ' + b.key + '（' + b.doc + '，' + arrs.length + ' 个数组）');
    L.push('');
    L.push('| 数组 | 稿板 | 尺寸 | 帧数 | 文件 | 色板 | 来源稿板 |');
    L.push('|---|---|---|---|---|---|---|');
    for (const a of arrs) {
      const pal = b.key === 'characters' ? 'PAL' : 'SEASON_PALS' + (b.key === 'phenology' ? '·本季' : '·四季');
      L.push('| ' + a.name + ' | ' + a.board + ' | ' + a.w + 'x' + a.h + ' | ' + a.files.length + ' | ' + a.files.map((f) => f.rel).join('、') + ' | ' + pal + ' | ' + a.doc + ' |');
    }
    L.push('');
  }
  L.push('## 派生资源（非像素数组，随导出生成）');
  L.push('');
  L.push('| 文件 | 说明 |');
  L.push('|---|---|');
  for (const r of plan.resources) {
    const desc = r.rel.includes('atlas_') ? 'world 16×16 地块四季 atlas' : r.rel.includes('tileset_') ? 'Godot 4 TileSet（TileSetAtlasSource，16×16 格）' : 'Godot 4 SpriteFrames（家族 `_数字` 生长态与 `_A/B/C` 工具三帧分组为多帧动画，余单帧）';
    L.push('| ' + r.rel + ' | ' + desc + ' |');
  }
  L.push('');
  return L.join('\n');
}

/* ---------------- 导出与复核 ---------------- */

function walk(dir) {
  const res = [];
  if (!fs.existsSync(dir)) return res;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...walk(p));
    else res.push(p);
  }
  return res;
}
function collectFiles(rootDir, managedRels) {
  const out = new Map(); // rel → Buffer（只收受管目录＋MANIFEST；.import 为 Godot 自有元数据，不比对）
  for (const base of managedRels) {
    const dir = path.join(rootDir, base);
    if (base.endsWith('.md')) {
      if (fs.existsSync(dir)) out.set(base, fs.readFileSync(dir));
      continue;
    }
    for (const f of walk(dir)) {
      if (!f.endsWith('.png') && !f.endsWith('.tres')) continue;
      out.set(path.relative(rootDir, f).split(path.sep).join('/'), fs.readFileSync(f));
    }
  }
  return out;
}

/* 洋红计数：解码 PNG，数不透明 #FF00FF 像素（硬性要求②） */
function countMagenta(rootDir) {
  let total = 0;
  const hits = [];
  for (const f of walk(rootDir)) {
    if (!f.endsWith('.png')) continue;
    const { w, h, rgba } = decodePNG(fs.readFileSync(f));
    let n = 0;
    for (let i = 0; i < w * h; i++) {
      if (rgba[i * 4] === 255 && rgba[i * 4 + 1] === 0 && rgba[i * 4 + 2] === 255 && rgba[i * 4 + 3] === 255) n++;
    }
    if (n) hits.push(path.relative(rootDir, f) + ':' + n);
    total += n;
  }
  return { total, hits };
}

/* MANIFEST 帧数对账：帧数列 = 文件列条数 = 磁盘实数 = 重导出实数 */
function checkManifest(manifestText, real, tmp) {
  const problems = [];
  const rows = manifestText.split('\n').filter((l) => /^\| [A-Z_0-9]+ \| (characters|world|phenology) \| /.test(l));
  if (!rows.length) problems.push('MANIFEST 无可解析数组行');
  for (const line of rows) {
    const c = line.split('|').map((s) => s.trim());
    const name = c[1], frames = Number(c[4]), files = c[5].split('、');
    if (!Number.isInteger(frames) || frames < 1) problems.push(name + ': 帧数列非法「' + c[4] + '」');
    if (files.length !== frames) problems.push(name + ': 文件列 ' + files.length + ' 条 != 帧数 ' + frames);
    for (const rel of files) {
      if (!real.has(rel)) problems.push(name + ': 磁盘缺文件 ' + rel);
      if (!tmp.has(rel)) problems.push(name + ': 重导出缺文件 ' + rel);
    }
  }
  return { rows: rows.length, problems };
}

function main() {
  console.log('board2godot: 解析三稿板…');
  const plan = buildPlan();
  /* audit 最新输出计数（本工具不重跑 audit；口径引用本次会话实跑 audit.cjs 输出：145/111/24） */
  plan.auditCounts = { characters: 145, world: 111, phenology: 24 };
  for (const [k, v] of Object.entries(plan.counts)) {
    console.log('  ' + k + ': ' + v.pixel + ' 个像素数组 / ' + v.consts + ' 个 const 声明（数据段）');
  }
  const frames = plan.arrays.reduce((s, a) => s + a.files.length, 0);
  console.log('  合计 ' + plan.arrays.length + ' 个数组 / ' + frames + ' 帧 PNG');

  if (!VERIFY_ONLY) {
    /* 全量导出＋清理受管目录内非本次导出的遗留 .png/.tres */
    const expected = new Set();
    for (const a of plan.arrays) for (const f of a.files) expected.add(f.rel);
    for (const r of plan.resources) expected.add(r.rel);
    expected.add('MANIFEST.md');
    let pruned = 0;
    for (const b of BOARDS) {
      const dir = path.join(ASSETS, b.out);
      for (const f of walk(dir)) {
        const rel = path.relative(ASSETS, f).split(path.sep).join('/');
        if ((rel.endsWith('.png') || rel.endsWith('.tres')) && !expected.has(rel)) {
          fs.unlinkSync(f);
          pruned++;
        }
      }
    }
    const manifest = buildManifest(plan, plan.auditCounts);
    const all = new Map();
    for (const a of plan.arrays) for (const f of a.files) all.set(f.rel, f.bytes);
    for (const r of plan.resources) all.set(r.rel, r.bytes);
    all.set('MANIFEST.md', Buffer.from(manifest, 'utf8'));
    for (const [rel, bytes] of all) {
      const abs = path.join(ASSETS, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, bytes);
    }
    console.log('导出：' + all.size + ' 个文件 → game/assets/' + (pruned ? '（清理遗留 ' + pruned + ' 个）' : ''));
  }

  /* ---- 复核（两种模式都跑）：重导出到临时目录，与磁盘逐字节比对 ---- */
  const managedRels = [...BOARDS.map((b) => b.out), 'MANIFEST.md'];
  const real = collectFiles(ASSETS, managedRels);
  if (!real.size) fail(VERIFY_ONLY ? 'game/assets 受管目录为空——先跑导出模式' : '导出后受管目录为空');
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'board2godot-verify-'));
  const tmp = new Map();
  for (const a of plan.arrays) for (const f of a.files) tmp.set(f.rel, f.bytes);
  for (const r of plan.resources) tmp.set(r.rel, r.bytes);
  const manifestText = buildManifest(plan, plan.auditCounts);
  tmp.set('MANIFEST.md', Buffer.from(manifestText, 'utf8'));
  try {
    let bad = 0;
    for (const [rel, buf] of tmp) {
      if (!real.has(rel)) { console.error('  MISMATCH 缺文件: ' + rel); bad++; }
      else if (!real.get(rel).equals(buf)) { console.error('  MISMATCH 字节不符: ' + rel); bad++; }
    }
    for (const rel of real.keys()) {
      if (!tmp.has(rel)) { console.error('  MISMATCH 多余文件: ' + rel); bad++; }
    }
    console.log((bad === 0 ? '比对 PASS：' : '比对 FAIL：') + tmp.size + ' 个文件逐字节' + (bad === 0 ? '一致' : '存在 ' + bad + ' 处出入'));

    const mag = (() => {
      let total = 0;
      const hits = [];
      for (const b of BOARDS) {
        const r = countMagenta(path.join(ASSETS, b.out));
        total += r.total;
        hits.push(...r.hits);
      }
      return { total, hits };
    })();
    console.log(mag.total === 0 ? '洋红 PASS：全部导出 PNG 的 #FF00FF 像素 = 0' : '洋红 FAIL：' + mag.total + ' px → ' + mag.hits.slice(0, 10).join(', '));
    if (mag.total !== 0) bad++;

    const mc = checkManifest(manifestText, real, tmp);
    console.log(mc.problems.length === 0 ? '帧数 PASS：MANIFEST ' + mc.rows + ' 行，帧数=文件列=磁盘=重导出' : '帧数 FAIL：\n  ' + mc.problems.join('\n  '));
    if (mc.problems.length) bad++;

    if (bad !== 0) {
      console.error('VERIFY FAIL（' + bad + ' 类出入）');
      process.exit(1);
    }
    console.log('VERIFY PASS');
    console.log('CONVERT_RESULT ' + JSON.stringify({ ok: true, arraysDone: plan.arrays.length, frames, files: tmp.size, counts: plan.counts }));
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

main();
