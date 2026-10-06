#!/usr/bin/env node
/* pixel-audit 审计器：宽度/行数/色键/语法，按 profile 参数化。
   用法：node audit.cjs characters|world|phenology|ui  （在 tarcadia 仓根执行） */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const PROFILES = {
  characters: {
    file: 'docs/pixel-characters.html',
    /* 期望行数：默认 32（全身/叠加层）；16（脸/物件）；WALK2=29；SIDE_OPEN_M/F=6、_J=5 */
    wantRows: (nm, h, w) => {
      if (nm === 'WALK2') return h === 29 ? null : ('腿段应 29 行（rows 20-28），实际 ' + h);
      if (nm === 'SIDE_OPEN_M' || nm === 'SIDE_OPEN_F') return h === 6 ? null : ('侧视腿段应 6 行，实际 ' + h);
      if (nm === 'SIDE_OPEN_J') return h === 5 ? null : ('侧视腿段应 5 行，实际 ' + h);
      if (h === 32 || h === 16) return null;
      return ('行数异常 ' + h);
    },
    width: 16,
    palKeys: `const PALSET=new Set(Object.keys(PAL));`,
  },
  world: {
    file: 'docs/pixel-world.html',
    /* 特例白名单：W_FOG 96×48——雾带横幅规格件（v1.1 天气层样张，research-stardew-assets-gap §2-A 归口补账） */
    wantRows: (nm, h, w) => {
      if (nm === 'W_FOG') return (w === 96 && h === 48) ? null : ('雾带应 96×48，实际 ' + w + '×' + h);
      const want = w === 16 ? 16 : 32;
      return h === want ? null : ('行数 ' + h + ' 与宽 ' + w + ' 不配（应 ' + want + '）');
    },
    width: null, /* 宽=首行长度，须 ∈{16,32,48}＋特例 W_FOG=96 */
    widthSet: [16, 32, 48],
    widthOV: { W_FOG: 96 },
    palKeys: `const PALSET=new Set(Object.keys(SEASON_PALS.spring).filter(k=>k!=='name'));`,
  },
  phenology: {
    file: 'docs/pixel-phenology.html',
    wantRows: (nm, h, w) => h === 16 ? null : ('icon 应 16 行，实际 ' + h),
    width: 16,
    palKeys: `const PALSET=new Set(Object.keys(SEASON_PALS.spring).filter(k=>k!=='name'));`,
  },
  ui: {
    file: 'docs/pixel-ui.html',
    /* 通用校验：宽=首行长 ∈ 16 的倍数集 {16,32,48,64,96,112}，行数 ∈ 同集；
       规格特例走 per-array 白名单（SIGN_SLIP 40×14、SEP_TRIDOT 96×4——签条/分隔线规格件非 16 倍数行数；
       TAB_SLIP/TAB_SLIP_ON 24×12——杂记五栏签条规格件，v0.2 增；
       OFFER_NORM/OFFER_NEW/OFFER_DONE 48×72——年集供单纸笺规格件（宽 48 入集、行数 72 特例），v0.3 增） */
    wantRows: (nm, h, w) => {
      const S = [16, 32, 48, 64, 96, 112];
      const OV = { SIGN_SLIP: [40, 14], SEP_TRIDOT: [96, 4], TAB_SLIP: [24, 12], TAB_SLIP_ON: [24, 12], OFFER_NORM: [48, 72], OFFER_NEW: [48, 72], OFFER_DONE: [48, 72] };
      if (OV[nm]) return (w === OV[nm][0] && h === OV[nm][1]) ? null : ('应 ' + OV[nm][0] + '×' + OV[nm][1] + '，实际 ' + w + '×' + h);
      if (S.indexOf(w) < 0) return ('宽 ' + w + ' ∉{16,32,48,64,96,112}');
      if (S.indexOf(h) < 0) return ('行数 ' + h + ' ∉ 同集');
      return null;
    },
    width: null,
    widthSet: [16, 32, 48, 64, 96, 112],
    widthOV: { SIGN_SLIP: 40, SEP_TRIDOT: 96, TAB_SLIP: 24, TAB_SLIP_ON: 24 },
    palKeys: `const PALSET=new Set(Object.keys(UI_PAL).filter(k=>k!=='name'));`,
  },
};

const profileName = process.argv[2];
const prof = PROFILES[profileName];
if (!prof) {
  console.log('用法: node audit.cjs characters|world|phenology|ui');
  process.exit(2);
}
const file = path.join(ROOT, prof.file);
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.log('FAIL: 无 script 段'); process.exit(1); }
const script = m[1];
const cut = script.indexOf('/* ===== 渲染器');
if (cut < 0) { console.log('FAIL: 找不到渲染器注释锚（数据段边界）'); process.exit(1); }
const data = script.slice(0, cut);
const names = [...data.matchAll(/const ([A-Z_0-9]+)=\s*\[/g)].map(x => x[1]);
const problems = [];
let count = 0;

/* 在数据段作用域内 eval：色板定义 + 数组定义 + 逐个检查 */
const code = data + `
;${prof.palKeys}
PALSET.add('.'); PALSET.add(' ');
const AUDIT_WSET = ${JSON.stringify(prof.widthSet || [16, 32, 48])};
const AUDIT_WOV = ${JSON.stringify(prof.widthOV || {})};
const AUDIT_NAMES = ${JSON.stringify(names)};
const AUDIT_WR = ${prof.wantRows.toString()};
const AUDIT_PROBLEMS = [];
let AUDIT_COUNT = 0;
for (const nm of AUDIT_NAMES) {
  const arr = eval(nm);
  if (typeof arr[0] !== 'string') continue; /* CAST/FACES/ITEMS 等数据表 */
  AUDIT_COUNT++;
  const w = ${prof.width === null ? 'arr[0].length' : prof.width};
  if (${prof.width === null ? '!AUDIT_WSET.includes(w) && AUDIT_WOV[nm] !== w' : 'false'}) AUDIT_PROBLEMS.push(nm + ': 宽 ' + w + ' 非法');
  const rowErr = AUDIT_WR(nm, arr.length, w);
  if (rowErr) AUDIT_PROBLEMS.push(nm + ': ' + rowErr);
  arr.forEach((r, j) => {
    if (r.length !== w) AUDIT_PROBLEMS.push(nm + '[' + j + ']: 宽 ' + r.length + ' != ' + w + ' [' + JSON.stringify(r) + ']');
    for (const ch of r) if (!PALSET.has(ch)) AUDIT_PROBLEMS.push(nm + '[' + j + ']: 未定义色键 "' + ch + '"');
  });
}
if (AUDIT_PROBLEMS.length) { AUDIT_PROBLEMS.forEach(p => console.log('  ' + p)); }
console.log((AUDIT_PROBLEMS.length ? 'FAIL ' + AUDIT_PROBLEMS.length + ' 处' : 'PASS') + ': ' + AUDIT_COUNT + '/' + AUDIT_NAMES.length + ' 个像素数组，宽/行数/色键' + (AUDIT_PROBLEMS.length ? ' 违规' : ' 合规') + '，色板 ' + (PALSET.size - 2) + ' 键');
if (AUDIT_PROBLEMS.length) process.exit(1);
`;
try { eval(code); } catch (e) { console.log('FAIL eval: ' + e.message); process.exit(1); }
try { new Function(script); console.log('SYNTAX PASS'); } catch (e) { console.log('SYNTAX FAIL: ' + e.message); process.exit(1); }
