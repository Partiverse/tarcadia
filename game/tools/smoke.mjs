#!/usr/bin/env node
// 仓库级引擎闸门（repo gate）：定位 Godot 4.x → 写 tools/godot.path 供复用 →
// headless 资源导入（--import）→ headless 冒烟场景。
// 任何一步失败（找不到 Godot / 版本非 4.x / import 非 0 / 冒烟非 0 / 未打印 SMOKE_OK）都 exit 非 0。
// 用法：node game/tools/smoke.mjs   （或仓库根任意 cwd，相对本文件自定位）

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url)); // game/tools
const gameRoot = resolve(here, '..');
const repoRoot = resolve(gameRoot, '..');
const pathFile = join(here, 'godot.path');
const fixture = join(gameRoot, 'assets', 'tiles', 'smoke_tile.png');

function fail(msg) {
  console.error('SMOKE_GATE_FAIL ' + msg);
  process.exit(1);
}
function tail(s) {
  const t = String(s || '').trim();
  return t ? t.split('\n').slice(-15).join('\n') : '(无输出)';
}

// ---- 1. 定位 Godot（env 覆盖 > PATH > 常见安装位）----
const candidates = [];
if (process.env.GODOT_BIN) candidates.push(process.env.GODOT_BIN);
const which = spawnSync('which', ['godot', 'godot4'], { encoding: 'utf8' });
if (which.status === 0 && which.stdout.trim()) {
  candidates.push(...which.stdout.trim().split('\n').filter(Boolean));
}
candidates.push(
  '/Applications/Godot.app/Contents/MacOS/Godot',
  '/Applications/Godot_mono.app/Contents/MacOS/Godot',
  '/usr/local/bin/godot',
  '/opt/homebrew/bin/godot',
);

let godot = null;
let version = '';

function probeGodot(bin) {
  if (!bin || !existsSync(bin)) return null;
  const r = spawnSync(bin, ['--version'], { encoding: 'utf8', timeout: 20000 });
  const out = ((r.stdout || '') + (r.stderr || '')).trim();
  if (r.status === 0 && /^4\.\d+/.test(out)) return { bin, version: out.split('\n')[0] };
  return null;
}

if (process.env.GODOT_BIN) {
  // 显式指定具权威性：无效即 fail，不许静默回退探测位。
  const hit = probeGodot(process.env.GODOT_BIN);
  if (!hit) fail('GODOT_BIN=' + process.env.GODOT_BIN + ' 不是可运行的 Godot 4.x');
  godot = hit.bin;
  version = hit.version;
} else {
  for (const c of candidates) {
    const hit = probeGodot(c);
    if (hit) { godot = hit.bin; version = hit.version; break; }
  }
}
if (!godot) {
  fail('未找到 Godot 4.x 可执行文件。探测过: ' + candidates.filter(Boolean).join(', '));
}
console.log('SMOKE_GATE godot=' + godot + ' version=' + version);
// 路径落盘供后续环节复用（不入库，见 game/.gitignore）
writeFileSync(pathFile, godot + '\n');

// ---- 2. 冒烟夹具（确定性字节；仅缺失时生成，非正典美术）----
if (!existsSync(fixture)) {
  mkdirSync(dirname(fixture), { recursive: true });
  writeFileSync(fixture, makePng16Checker());
  console.log('SMOKE_GATE fixture 已生成: ' + fixture);
}

// ---- 3. 资源导入 ----
let r = spawnSync(godot, ['--headless', '--path', gameRoot, '--import'], {
  encoding: 'utf8',
  timeout: 180000,
});
if (r.error || r.status !== 0) {
  fail('godot --import 失败 exit=' + r.status + (r.error ? ' err=' + r.error : '') + '\n' + tail(r.stdout) + '\n' + tail(r.stderr));
}
console.log('SMOKE_GATE import ok (exit 0)');

// ---- 4. 冒烟场景 ----
r = spawnSync(godot, ['--headless', '--path', gameRoot, 'res://scenes/smoke.tscn'], {
  encoding: 'utf8',
  timeout: 120000,
});
const out = (r.stdout || '') + (r.stderr || '');
console.log(out.trim());
if (r.error || r.status !== 0) {
  fail('冒烟场景失败 exit=' + r.status + (r.error ? ' err=' + r.error : ''));
}
if (!out.includes('SMOKE_OK')) {
  fail('冒烟场景 exit 0 但未输出 SMOKE_OK（探针断言未走到）');
}

console.log('SMOKE_GATE_OK godot=' + version);
process.exit(0);

// ==== 16×16 双灰棋盘 PNG（RGB8，手拼 chunk，无外部依赖）====
function makePng16Checker() {
  const W = 16, H = 16;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  let o = 0;
  for (let y = 0; y < H; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < W; x++) {
      const v = ((x >> 1) + (y >> 1)) % 2 === 0 ? 0xc0 : 0x80;
      raw[o++] = v; raw[o++] = v; raw[o++] = v;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: truecolor RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
