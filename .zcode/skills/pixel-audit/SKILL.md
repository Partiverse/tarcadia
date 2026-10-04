# Pixel Audit — tarcadia 像素稿板验证链

改 `docs/pixel-characters.html`、`docs/pixel-world.html`（或按同制式新建的稿板）后**必跑**四步验证链。历史战绩：此链抓出过全页渲染中断雷（WALK2 缺行）、道具 K 线违规、宽 17/行数 31 等 20+ 处缺陷——不跑就 push 等于盲飞。

## 何时触发

- 用户说「跑验证链 / 审计稿板 / pixel-audit / 改完稿板了」
- 任何对稿板像素数组（`const XXX=[...]`）、色板（PAL/SEASON_PALS）、渲染接线的修改之后
- commit 前必须全绿

## 稿板背景（30 秒版）

- 稿板＝单文件 HTML，全部精灵为 `<script>` 内手排字符矩阵（字符=色键），零依赖零生图（美术宪法）
- 人物稿板：16 宽 × 16/32 行数组＋WALK2（29 行腿段）＋SIDE_OPEN 腿段（6/6/5 行）＋overlay 叠加层
- world 稿板：16/32/48 宽；地块 16×16 全填充，建筑 32×32 或 48×32，四季色板键名同构
- 色键未定义会渲染成洋红 `#F0F` 兜底——这就是步骤 3 洋红计数的原理

## 步骤 1 — 宽度/色键/行数审计

```bash
node .zcode/skills/pixel-audit/scripts/audit.cjs characters   # 人物稿板
node .zcode/skills/pixel-audit/scripts/audit.cjs world        # world 稿板
```

输出 `PASS`/`FAIL+清单`/`SYNTAX`。FAIL 逐条修复后重跑直到 PASS。审计器只认既有特例（WALK2、SIDE_OPEN_*）；若稿板新增了非标准行数的结构化数组（如新腿段），先改脚本里的 profile 再跑，别绕过。

## 步骤 2 — 运行时探针

渲染中断不一定报错（callback 里静默死），必须探针确认 `fullRender` 走完：

```bash
cp docs/<board>.html /tmp/probe.html
# 注入（python，锚点必须用 "</script>" 前的最后一个 fullRender(); 调用——
# 警告：replace("fullRender();\n") 会误匹配按钮回调里的同名调用，探针就插进了永不执行的闭包）
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --enable-logging=stderr --v=0 \
  --virtual-time-budget=4000 --dump-dom "file:///tmp/probe.html" 2>&1 | grep PROBE
```

注入模板（error 捕获＋关键计数，计数对象按改动选）：

```js
window.addEventListener('error',e=>console.log('PROBE_ERR',e.message,e.lineno));
fullRender();
console.log('PROBE_after cast=',CAST.length,' faces=',<按需>);
```

无 `PROBE_ERR` 且计数符合预期才过。

## 步骤 3 — 截图＋目测

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1280,<按内容高度+余量> \
  --virtual-time-budget=6000 --screenshot=/tmp/board.png "file://$PWD/docs/<board>.html"
magick /tmp/board.png -fuzz 0% -fill white -opaque '#F0F0F0' -fill black +opaque white \
  -format '洋红兜底: %[fx:int(mean*w*h)]px\n' info:
magick /tmp/board.png -crop 1280x<节高>+0+<节y> +repage -resize 42% /tmp/band.png
```

- 洋红计数必须为 0
- 本机 Read 工具读图会转 CDN URL——把 URL 交给 `mcp__4_5v_mcp__analyze_image` 目测，prompt 要点：格子数、特征件可辨性、邻接/衔接、畸形与洋红
- 页面高度按节增多调大 window-size，截不够会误判段缺失

## 步骤 4 — 剪影闸门

```bash
sed 's/const state={sil:false,/const state={sil:true,/' docs/<board>.html > /tmp/probe_sil.html
# 用 probe_sil.html 再截一张，裁同一节
```

标准：**人物卡/建筑卡**纯黑下仍可辨认（认不出=回炉，不许上色救）；**地块**剪影整片黑无漏点（全填充证明）。人物卡的色卡条 chips 是 HTML 文档元素，剪影下保留原色属设计内行为，不算残留。可用像素探针辅助：新内容主色在剪影图精确匹配应≈0。

## 已知陷阱（都踩过）

1. Bash 写 `/tmp/*.cjs` 被 mimosa hook 拦——临时脚本一律 Write 工具落盘再 Bash 只读执行
2. `node -e` 内联含中文/引号脚本必炸——写文件跑
3. 手排宽 32/48 的行长度必错——用生成脚本拼装（mid 段＋`center(w,'.')` 补点）再落字面量
4. `forEach` 会跳过 sparse 数组的洞——行数检查要显式判 `arr.length`
5. 探针注入锚（见步骤 2 警告）
6. `analyze_image` 的 OCR 会读错 caption 字——格子数以 DOM/探针计数为准，视觉判断以像素事实为准

## 全绿后的收尾

稿板版本号按 HANDOFF 变更协议（人物稿板：批次不升 minor；world 稿板：新节气节升 minor）→ 更新 HANDOFF 状态 → git commit（信息含验证结论）→ push。
