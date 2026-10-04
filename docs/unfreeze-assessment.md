# 桃花源（Tarcadia）实现阶段解冻评估 v1.1

> 版本 v1.1 · 2026-10-04 · 评估人：解冻评估（工作流外派会话，只产工件不改主仓）
> v1.1 补正：按独立读稿人意见补时间量级、预算量级、人力/引擎/音频现状盘点、资产总量级实点、解冻门槛核对清单，并修正 13 处表述（记录见文末附录 B）。
> 输入：`HANDOFF.md` 全文、`docs/production-scope.md`、`docs/feasibility.md`、`docs/vertical-slice-design.md`、`docs/process-log.md`、三稿板尾部（footer 与收官节）、`docs/art-style-guide.md`、`docs/character-roster.md`、`docs/bus-factor.md`、`docs/outsource-review-form.md`、`docs/audio-brief.md`、`docs/reviews/phenology-v0.5.md` 相关行、本工作流三批结果（冬四作物批 v0.9、竹树形批 v1.0、审稿单试填批）。
> 性质：本文档是依据汇报，不是解冻授权。解冻与否是用户决议（HANDOFF.md:4 铁律「实现阶段冻结」的解除权在用户）。

**核对口径**（本次实跑）：`ls docs/` 与 `wc -l` 清点文档；`git ls-files docs/*.md`（24 件）＋ `git status --short docs/`（2 改 1 新增）；`grep -ohE` 提取全仓 `.md` 引用名并逐个 `[ -f ]` 存在性核对；读三稿板 footer（pixel-characters.html:245-248、pixel-world.html:225-228、pixel-phenology.html:221-224）；`git log --diff-filter=A` 核对入仓时间。v1.1 追加实跑：`find` 根目录引擎工程文件（project.godot/*.csproj/Cargo.toml/package.json 等，**0 结果**）；`find` 音频文件（*.wav/*.ogg/*.mp3/*.aiff/*.flac，**0 结果**）；`grep -cE '^const [A-Z]'` 三稿板数组计数（175/133/32）；`grep -cE '^const F_'` 人物立绘数组（68）；`git log --name-only` 全史文件类型分布（56 md＋23 html＋2 cjs＋1 gitignore，**零代码文件**）。文中论断均给出处；未实跑的检查如实标注。

---

## ① 资产盘点

### 1.1 人物稿板 `docs/pixel-characters.html`（v0.7 批 4 · 人物篇收官）

- **已完成**：18 人像素层全齐（CAST 8→18，含量产 5 人与半线拣选 2 人：周满/刘铁生）；立绘 68 帧（17 组，`const F_*` 数组实点 68 个）；表情体系 15 型（主角 5、江客 3、女原型 3、NPC 方言 4，HANDOFF.md:10）；主角男/主角女/江客独立侧视行走 4 帧＋其余 16 人复用三套骨骼换色（art-style §4 C 折中案兑现）；工具五类×3 帧叠加数组（锄/壶/镰/斧/竿）；四方向切片；16×16 信物 4 件（全页唯一朱砂＝定亲红绦）；年集 18 人真名册同屏（`FAIR_ORDER=0..17`，换色逻辑退役）；最终剪影闸门通过。footer 验收链：「剪影可辨 · 四方向齐 · 工具五类三帧 · 表情 68 型 · 行走独立三套 · ×1 远景可辨 · 年集 18 人同屏不混 · 朱砂=人情事件」（pixel-characters.html:247）。
- **数源冲突待勘**：footer「表情 68 型」与 HANDOFF.md:10「表情 8→**15 型**」矛盾。实跑证据支持裁定为 footer 错植：`grep -cE '^const F_' docs/pixel-characters.html`＝**68**，恰等于 HANDOFF.md:12「立绘 48→68」的立绘数组数——68 是立绘帧数不是表情型数，表情真值＝15 型体系。已列入 S3 勘误项（footer 文字，不动数组）。
- **对切片的意义**：vertical-slice-design §8 要求「主角男女两套 16px 精灵＋tileset 复用」。稿板实际帧格为 16×32（宽 16 × 高 32，HANDOFF.md:9 记 v0.3 由 16×20 升格脱幼态）——单格宽与 §8 的「16px」品类口径一致（星露谷人物即 16×32 帧格），高度差是实现期按帧格切割即可处理的规格差异，不是资产缺陷，也不是「向上兼容」意义上的兼容问题：就是字面 16×32，切帧即用。

### 1.2 world 稿板 `docs/pixel-world.html`（v1.0 · 世界篇收官，**本工作区未 commit**）

- **已完成**：春季 12 地块＋四季色板管线（`SEASON_PALS` 键名同构纯换色，矩阵零改动）；作物层**全册收官**——一年生 24 种×三态（春 8＋夏 8＋秋 5＋冬 3：蒜/冬麦/绿肥）＋田外之田多年生五件双帧（pixel-world.html:226 footer）；四种树形（圆冠/斜枝/平冠/竹林）；建筑 11 件（8 民居＋小卖部＋飞廊＋祠堂）生成器流水线产出；autotile 8bit 256 掩码＋内角角块（草/犁沟/水三系）；24 格溪田单屏拼接（对位 vertical-slice-design §2）；稿板含 12 个节（`id="t-*"` 实点 12）。
- **本工作流补齐（新增量的准确边界）**：冬四作物批（v0.9，新立小雪节 `t-cropsw`，pixel-world.html:219-223——冬茶裁决为「不立一年生格作物、茶丛延采记账」，CHA_BUSH/CHA_BUSH_F 双帧 note 即「冬茶线」pixel-world.html:1387-1388；株型零新增，蒜抽薹/冬麦越冬雪被/绿肥匍匐）＋竹树形批（v0.9→v1.0，第四种树形竹林 ZHU_GROW/ZHU_READY 双帧，pixel-world.html:1087/1105/1389-1390，寒露·田外之田节并入）。**多年生「五件」构成＝橘/梨/栗/茶四件双帧早已在板（HANDOFF.md:40，v0.7 收官），本工作流只新增竹 2 卡（TREES 8→10，pixel-world.html:1380-1390）**。
- **工作区状态警告**：上述 v0.9/v1.0 全部内容（连同 art-style-guide.md 挂链改动与新增的 outsource-review-form.md）**未 commit**（`git status --short docs/`＝` M docs/art-style-guide.md`、` M docs/pixel-world.html`、`?? docs/outsource-review-form.md`）。HANDOFF §6.1 仍记「余量仅冬 4 与竹」为欠账（HANDOFF.md:40）——已过时，两笔欠账实已清。

### 1.3 魂层稿板 `docs/pixel-phenology.html`（v0.5 · 物候牌篇关账）

- **已完成**：四季 24 枚物候 icon 全册（选题正典＝design-board TERMS 每段 micro[0]）；廿四格罗盘历法环（主界面唯一常驻 UI，presentation-ux §4.1 已锁）：四象限四时五行、四条板名色键弧带、当前段高亮三重证法；檐牌样张与四立牌四季变体（icon 垫宣纸签底衬）；外派对抗性评审 9 项发现整改全收（docs/reviews/phenology-v0.5.md）。footer 验收链：「选题出自 TERMS micro · 四季 24 枚全册 · 罗盘 24 格收官 · 键 ∈ 本季 12 色板 · 留白过半 · 朱砂零 · 剪影可猜」（pixel-phenology.html:223）。
- **术语注释**：「三重证法」＝HANDOFF.md:50 原文「格证墨框＋针证罗盘针纯墨 2px＋心证天心镜整段重绘」——即当前节气格用三种互相独立的视觉通道同时标亮：①格证＝该格加墨色边框；②针证＝罗盘针（纯墨 2px）指向该格；③心证＝环心「天心镜」小窗整格重绘当前段的物候 icon。任何一种通道色弱/被遮挡，另两种仍可读。
- **对切片的意义**：罗盘历法环＋物候 icon＝切片 §3.1「历法 UI 用罗盘式 24 节气环」与「6–8 个环境物候线索」的 UI 素材已有着落。

### 1.4 本工作流三批补齐（汇总）

| 批 | 结论 | 落点 |
|---|---|---|
| 冬四作物 | 冬茶正典裁决＝茶丛延采零新像素；蒜/冬麦/绿肥入板株型零新增；新立小雪节（协议 v0.8→v0.9） | pixel-world.html:219-223、:1387-1388 |
| 竹树形 | 第四种树形竹林＋破土笋采集事件帧，四季色板自动换季零额外工作量；五版生成脚本迭代＋回读断言 | pixel-world.html:1082-1105、:1389-1390 |
| 审稿单试填 | 新建 `docs/outsource-review-form.md`（条款 1–9 打勾栏＋我方证据栏＋退回条件栏＋附录盲测基准四枚）；art-style-guide.md §5 末挂链 | outsource-review-form.md 全文、art-style-guide.md:43-45 |

### 1.5 资产总量级（实点口径）

| 稿板 | `const` 数组声明数（`grep -cE '^const [A-Z]'`） | 已载关键计数（HANDOFF/footer 实文） |
|---|---|---|
| pixel-characters.html | **175**（含 PAL/CAST 等非精灵数组，此为上限） | CAST 18；立绘 F_* 68 帧（实点）；表情 15 型；工具 13 组叠加数组；行走骨骼 3 套 |
| pixel-world.html | **133**（含 SEASON_PALS/TREES 表等） | 一年生 24 种×三态＝72 帧；多年生 5 件×2＝10 帧；四季 12 地块色表×4；建筑 11 件；autotile 三系 256 掩码 |
| pixel-phenology.html | **32** | icon 24 枚；罗盘 1 套（复用 ICONS 零新增数组，HANDOFF.md:51） |

- 合计约 **340 个数组声明**（含色板/花名册等配置，逐帧格总数未解析——audit 脚本可数（HANDOFF §3），本文只给声明级量级，不冒充精确帧数）。
- **迁移工作量据此估**：340 个数组是导出工具要处理的全部输入面；换季靠 4 张键名同构色表（pixel-world.html:232-236），不需要逐帧重排。这是量级参考，不是工期承诺。

### 1.6 音频资产盘点（独立读稿人指出的缺口，补）

- **现状＝纯文档阶段，音频产出为零**：`find` 全仓 *.wav/*.ogg/*.mp3/*.aiff/*.flac＝**0 个文件**。已有的是两张需求文档：audio-brief.md（三层声音架构：物候声景/功能音/配乐 15 曲＋4 节令短曲）与 sfx-catalog.md（外包报价单+验收单）。
- **切片需要音频**：vertical-slice-design §8 音频行明确「3 首循环 BGM（晨/集/夜）＋外包询价验证」，§9 排在 M6（占位美术替换同期）。当前无样稿、无报价——audio-brief.md:41 把报价+样稿挂在 **M7**，比切片 §9 的 M6 还晚一拍，两文档排期口径本身有一拍出入（列入 S3 勘误）。
- **结论**：音频是切片关键路径上**尚未启动**的采购线（需外包询价），不是资产缺口而是流程缺口；Gate 1 盲测无音频也可跑，但 §8 字面要求含 BGM，M6 前必须至少落 3 首循环曲。

### 1.7 引擎/代码侧现状（独立读稿人指出的缺口，补）

- **Godot 工程不存在**：`find` 根目录 project.godot/*.csproj/Cargo.toml/package.json 等＝**0 结果**；仓根只有 HANDOFF.md、README.md、docs/ 与配置目录。git 全史文件类型＝56 md＋23 html＋2 cjs＋1 gitignore，**零代码提交**。
- **解读**：本仓至今是纯设计文档仓＋三块 HTML 稿板；「解冻」的产出是**从零开始**的 M1 灰盒（vertical-slice §9 M1＝设计定稿+纸面数值+灰盒地图），不是续写已有代码。程序侧无人、无工程、无导出管线——引擎资产（sprite sheet）数量＝**0**，齐备的只是设计侧像素源。
- 导出路径未演练（详见 ④T1）：audit 解析器能读数组是**起点不是终点**，字符矩阵到引擎可用 sprite sheet 之间还差导出工具开发（帧格切割、锚点/层序元数据、四季色表绑定）与视觉回归比对。

### 1.8 人力现状核对（独立读稿人指出的缺口，补）

- **仓内零人员信息**：production-scope §9 的 4–5 人编制（程序 2＋美术 1+外包 2–3＋文案 1＋机动 1）是**排期假设**，不是在岗名册；bus-factor.md 的单点登记册同样以该假设为前提。全仓无人员名册、无在岗记录、无合同存档。
- 可核实的事实只有：至今全部产出（文档链 25 件＋三稿板）为 2026-10-02 至 10-04 的 ZCode 会话产物（HANDOFF.md:3「状态截至 2026-10-04（ZCode 会话）」；git 近史全部为 docs/phenology 提交）。
- **结论：当前实际有几人、谁在岗、外包是否签约，属仓外事实，本评估无法核对，决策者须自查。** 这直接决定下节所有工期数字是「排期假设」还是「可执行计划」。

### 1.9 仍 gated 的余量与触发条件（以 HANDOFF 实文为准）

| # | 余量 | 出处 | 触发条件 | 是否阻塞切片 |
|---|---|---|---|---|
| G1 | 季节外罩剪影 | HANDOFF §2.1（:21） | world 层排期后再议 | 否 |
| G2 | 半线 4 人像素（何知青/陈桂芳/方阿婆/谭慧；周满/铁生已入板） | HANDOFF §2.2（:22） | 临水镇戏份落地时按批 2/3 模板补卡；EA 明确不含半线补全（production-scope.md:21、§11） | 否 |
| G3 | 木匠女围裙区分度 | HANDOFF §2.3（:23） | 外包审稿反馈同结论则加 1px 墨斗挂链外沿 | 否 |
| G4 | autotile 石板/梯沿/花草系接入 | HANDOFF §6.3（:42） | 场景铺图时按需 | 否（切片溪田用已收三系够用） |
| G5 | 罗盘环标注字的结构色语义裁决 | reviews/phenology-v0.5.md:96-100（发现 #9，接受挂账） | 缺的裁决是：环上题名/段名说明字现用页级结构色靛青 #31475F（pixel-phenology.html:503 IND、:527/:547 fillStyle），而色彩语义纪律规定靛只给染坊人衣/知识类（presentation-ux §4.2）——实现期须给环标注字**另定结构色语义**（换色或豁免记账），二选一，未裁 | 否（实现期裁决项，非资产缺口） |
| G6 | 弱剪影四枚（大寒/春分/小雪/小满）＋檐牌双穗形近 | reviews :90-94（发现 #8，登记不翻案） | 作为外包批次盲测基准使用（outsource-review-form.md:120 附录） | 否 |
| G7 | 檐牌/签筒/加载图 | HANDOFF §4（:36） | 实现阶段跟随件 | 否 |
| G8 | 恋爱信物 12 件贴图 | art-style-guide.md:29 | 量产外包清单最高优先级；切片明确不做恋爱（vertical-slice-design §8「明确不做」） | 否 |
| G9 | 水墨过场概念稿 2 张 | vertical-slice-design §8 美术行 | M6 占位美术替换时（§9 排期） | 否，但 M6 前必须补（见 ③S1） |
| G10 | HANDOFF §5 未决拍板项：年集 18 人骨骼账、半线 6 人性别账 | HANDOFF.md:58 | 性别账实际已在 character-roster.md:60/105 对账完毕（男女主镜像各 6）——HANDOFF 条目滞后；骨骼账已被「真 18 人本卡直排」实质解决（HANDOFF.md:11） | 否，属落账动作 |

---

## ② 上游 21 件套决议齐备性核对

HANDOFF.md:57 记「上游决议链（立项/数值/文案 21 件套）读 docs/ 各文件头部 upstream/downstream 注」。**实际清点结果：决议文档 22 件，全部在盘**（24 件 tracked md − process-log.md − research-stardew-characters.md；outsource-review-form.md 为本工作流新增未入册工件，不计）。全仓 `.md` 引用名经逐个存在性核对，**22 件互相引用闭合，无缺档**。三处例外如实报告：

- `yearnumbers.md`（production-scope.md:42 引用、pixel-world.html lede 亦作 yearnumbers §10）——实际文件名是 `yeard-numbers.md`，属**引用名笔误**非缺档；
- `runbook.md`（bus-factor.md:13）——是 M9 前才要求存在的**规划交付物**（bus-factor §3 第 2 条），非缺档；
- 记账数与实存数差 1：「21 件套」的点名清单全仓无第二处可对（grep「21 件」仅 HANDOFF.md:57 一处）。

**验收口径（可判定，终结 21/22 之争）**：验收以本节下表的 **22 件实存清单**为准——逐件 `[ -f docs/<名>` 全过即通过（本文已跑，全过）；「21 件套」字样视为待勘误的历史记账（列入 S3，由主会话补点名清单说明 22 件中哪件入册晚于记账，本文不再猜）。若严格按「立项/数值/文案」口径把 art-style-guide.md 归稿板侧产物不计，则恰为 21 件——此系口径推断，**不作为验收依据**。

实存 22 件清单（全部存在 ✓）：

| 组 | 文件 |
|---|---|
| 总纲与切片（4） | feasibility.md、vertical-slice-design.md、slice-numbers.md、slice-calendar.md |
| 量产范围与数值（3） | production-scope.md、yeard-numbers.md、chusi-numbers.md |
| 世界与叙事（3） | world-layers.md、narrative-mainline.md、gathering-almanac.md |
| 人物与文案（4） | character-style.md、character-roster.md、outbound-kinship.md、quest-scene-style.md |
| 呈现与美术（2） | presentation-ux.md、art-style-guide.md |
| 饮食（1） | cuisine-45.md |
| 音频（2） | audio-brief.md、sfx-catalog.md |
| 发行与风控（3） | community-ops.md、glossary-en.md、bus-factor.md |

---

## ③ 解冻前差距清单

### 硬差距（不补不能开工）

| # | 差距 | 依据 | 说明 |
|---|---|---|---|
| H1 | **三批成品归档落账**：pixel-world.html（v0.9+v1.0）、art-style-guide.md（§5 挂链）未 commit；outsource-review-form.md 未 add；HANDOFF.md §6.1 欠账账目（冬 4/竹）与 §5 未决项（性别账）未更新 | `git status --short docs/` 实跑输出；HANDOFF.md:40 vs pixel-world.html:226；HANDOFF.md:58 vs character-roster.md:60 | 本仓纪律是外派只产工件、主会话归档。解冻后任何改动都将叠在无基线的未落账工作区上，diff 不可审。动作量＝一次 commit＋HANDOFF 两节勘误＋②/S3 所列引用修正；**未估工时（无依据，不给数）** |
| H2 | **解冻范围决议本身**：解除 HANDOFF.md:4「实现阶段冻结」铁律是用户决议，无文档可代替 | HANDOFF.md:4 | 本评估只能证明资产侧无阻断缺口，不能代签解冻 |

**像素资产侧无硬差距**；但齐备结论限定口径：齐备的是**设计侧像素源**（三稿板字符矩阵），**引擎可用资产（sprite sheet）＝0**（①1.7），迁移是解冻后第一项工程工作而非已完成项；切片 §8 清单中的水墨概念稿（G9）与 3 首 BGM（①1.6）也无产出，属 M6 前并行补件（S1/S8），不在「现在就能开工」的阻塞面内。

### 软差距（开工后可并行补，附最晚时点）

| # | 差距 | 最晚时点 | 依据 |
|---|---|---|---|
| S1 | 水墨过场概念稿 2 张 | M6 末（占位美术替换） | vertical-slice-design §8、§9 |
| S2 | runbook 三件套（加作物/加 NPC/加事件），由非作者跑通一次 | M9 前 | bus-factor.md §3-2、:13 |
| S3 | 文档勘误包：①HANDOFF 21/22 件套点名清单（②节验收口径）；②production-scope.md:42 与 pixel-world.html lede 的 `yearnumbers.md`→`yeard-numbers.md`；③HANDOFF §5 性别账条目对账（G10）；④pixel-characters.html:247 footer「表情 68 型」改「立绘 68 帧 · 表情 15 型」（①1.1 实点裁定）；⑤audio-brief.md:41 报价时点 M7 与切片 §9 M6 需 BGM 的一拍出入对齐 | 开工首周顺手 | 各处已注 |
| S4 | 考据公共簿（docs/research-notes/）启动 | M7 起滚动，缺失不阻塞 EA | bus-factor.md §4 |
| S5 | Gate 1 盲测组织方案（8–12 名目标用户招募） | M6 前启动 | vertical-slice-design §10、feasibility §5.3 |
| S6 | 恋爱信物 12 件、临水镇街面组件库等量产美术外包包 | M9–M12（基准集定稿后才开外包） | art-style-guide.md:36-39、:29 |
| S7 | **音频线启动**：按 audio-brief §3 清单外包询价，至少落切片 3 首循环 BGM（晨/集/夜）＋物候声景 1 组样稿 | M6 前（切片 §8 字面要求）；全量挂 M7 报价/M9 声景交付（audio-brief.md:41-42） | audio-brief.md、vertical-slice-design §8 |
| S8 | G1–G8 全部 gated 余量 | 各自触发条件（见 ①1.9 表），无一在切片关键路径 | HANDOFF §2/§4/§6 |

---

## ④ 风险表

### 时间量级（全部为文档排期假设，非实测；成立前提见 ①1.8 人力现状）

| 阶段 | 工期 | 出处 |
|---|---|---|
| 解冻→灰盒开工（M1） | 解冻当月：设计定稿＋纸面数值＋灰盒地图 | vertical-slice-design §9 |
| 解冻→切片可玩＋Gate 1 盲测（M0–M6） | **6 个月**：M2 可玩灰盒、M3 经济+加工链、M4 烹饪、M5 NPC+事件贯通、M6 占位美术替换＋盲测 | vertical-slice-design §9 |
| 解冻→EA 发售 | M18（feasibility §4.3 路线 M0–M42；production-scope §9 里程碑 M9 灰盒可通/M12 封版/M15 试玩/M16–M18 打磨+本地化） | feasibility.md:86-92、production-scope.md:100-105 |

这些日历在仓内文档是齐全的；缺的是**把它们与真实在岗人力对上**——若 4–5 人编制未组建，上表全部顺延，顺延多少无仓内依据可算。

### 预算量级（仓内已有的数字；无单价处如实说无）

| 项 | 数字 | 出处 |
|---|---|---|
| B 档总成本带 | **$150k–500k（国内约 ¥150–250 万）**，周期 2.5–3.5 年 | feasibility.md:70-71 |
| 回本线 | $25 × 3.2 万份 | feasibility.md:101 |
| 兼职社区运营（触发制） | ¥48k/年量级，M12 起愿望单运营周时 >10h 触发 | bus-factor.md:14 |
| 音频外包 | **未定价**——全外包，M9 前完成报价与样稿（production-scope.md:98）；audio-brief §3 的 15 曲+4 短曲清单即询价底稿 | production-scope.md:98、audio-brief.md:18 |
| 美术外包 | **未定价**——编制「1+外包 2–3」，包干制无单价 | production-scope.md:95、art-style-guide.md:34-39 |

- 读稿人问「外包量应收缩多少」：**收缩量无法量化**——仓内没有美术/音频单价，没有基准。能给的可核事实是：production-scope.md:95 列为外包的「作物 28 帧」已由稿板自产完毕（一年生 24 种＋多年生 5 件，pixel-world.html:226），「3 新图 tileset」的村庄部分同样已自产——外包清单里这两项趋零，剩余大头是信物 12 件、临水镇组件、除祟 icon、全部音频。解冻后第一轮询价应以剩余项重做。

### 技术

| 风险 | 依据 | 缓解 |
|---|---|---|
| 稿板矩阵→引擎资源迁移**无先例**：三稿板是 HTML 内手排字符矩阵，Godot 工程不存在（①1.7），字符矩阵与引擎可用 sprite sheet 之间还差导出工具（帧格切割/锚点/层序/四季色表绑定）与视觉回归——「audit 解析器能读数组」只是起点，不是已验证路径 | `find` 实跑 0 引擎文件；HANDOFF.md:4（冻结）；①1.5 量级 | 解冻首周做导出 spike，成功标准定为可判定项：**至少 1 角色＋1 作物＋1 树进 Godot 画面，与稿板截图逐帧比对一致**；键名同构色板把换季压到 4 张色表（pixel-world.html:232-236）降低迁移面 |
| 渲染静默中断类缺陷（WALK2 先例）与验证链盲区（icon×载体合成先例）在实现期复发 | process-log.md:24（漏网案例）、:46（四步链盲区） | 验证链已固化为 `.zcode/skills/pixel-audit/`（HANDOFF §3）；条款 9 强制「载体实装合成稿＋我方盲测」（process-log.md:73）；实现期把探针断言搬进 CI 等价物 |
| 宽 32/48 手排错率高——这是**台账实弹归纳的防错规范，不是逻辑必然**：台账 5 例（锄 A/B/C、建筑行、JU_TREE 重复声明，process-log.md:26/33） | process-log §2 | 纪律照旧：宽 32/48 一律生成脚本拼装（process-log §4-1）；本工作流竹批沿用并加「替换后回读断言」 |
| 三批成品未落账即开工，改动无基线 | git status 实跑 | ＝硬差距 H1，开工前 commit |

### 产能

| 风险 | 依据 | 缓解 |
|---|---|---|
| 文案 1,800 句单写手，全表最紧产能 | production-scope.md:82-83 | 降级预案已锁（砍地图 30% 保文案）；外判分级接口已建（character-roster.md:100）；对话 CSV schema 化＋闲话池整包外判（bus-factor.md:12） |
| 美术 1 主美＋外包 2–3 的审稿包干是单点——**审稿单降低的是判据漂移与返工风险（口径外化成 9 条可执行清单），不增加审稿人力，人力单点仍在** | production-scope.md:95、bus-factor.md:15 | bus-factor #4 原缓解继续有效：审稿口径样例库双轨缓存＋源文件不交付不付尾款；审稿单（outsource-review-form.md）使「换人审稿」从口传变成照单执行，缩短单点失联的恢复时间，但**不消除单点** |
| 音频线零启动（①1.6）：切片 §8 要求 3 首 BGM，现无样稿无报价，且报价挂 M7 晚于 M6 需求 | audio-brief.md:41 vs vertical-slice-design §8/§9 | S7：解冻即发询价（audio-brief §3 清单即询价底稿），把报价时点从 M7 提到 M6 前；音频供应商可换属性已锁（bus-factor.md:16 分 stem 交付） |
| Gate 1 盲测（8–12 名真人用户）招募未启动 | vertical-slice-design §10 | S5：M6 前启动招募，机制挂 community-ops 渠道矩阵 |

### 外包合同

| 风险 | 依据 | 缓解 |
|---|---|---|
| 交付质量不齐导致反复退返 | process-log §2 台账（尺寸/色键/剪影/比例四类实弹） | 条款 1/2 为脚本拦截层（触发即整批退、不进人工审稿，outsource-review-form.md:20）；条款 3 先剪影后彩色，减少返工面 |
| AI 生图混入管线（口碑死亡＋Steam 披露义务） | feasibility.md:80（AI 纪律）、art-style-guide.md §6、:72（全款拒付） | 条款 8 全款拒付＋参考图来源声明栏（outsource-review-form.md:92-102） |
| 供应商跑路/失联（音频全外包、EN 两级外包） | bus-factor.md:16-17 | 分 stem 交付制式已锁（sfx-catalog.md 头注），中途终止可无损续作；audio-brief+sfx-catalog＝「可换供应商的文档就是防单点的文档」（bus-factor.md:16） |
| 源文件不交付（原创性举证失败） | art-style-guide.md:41 合同三条款之一 | 条款 7 收件即退、无源文件不付尾款（outsource-review-form.md:82-88） |
| 基准集未定即开外包导致整批返工 | art-style-guide.md:36（M6–M9 外包＝0） | 时序纪律：风格基准集定稿前不签外包画单 |

---

## ⑤ 结论与解冻门槛

### 5.1 资产是否齐备（限定口径，不含被自己推翻的全称判断）

- **齐备的**：切片所需的**像素设计资产**全部有关账级交付——主角双精灵＋行走＋工具（pixel-characters.html v0.7）、溪田 24 格拼接＋12 春地块＋四季管线＋作物建筑（pixel-world.html v1.0）、罗盘历法环＋24 物候 icon（pixel-phenology.html v0.5）；三稿板验证链全绿（footer :247/:227/:223）。本工作流三批把 world 篇最后两笔挂账（冬四作物、竹）清零。
- **不齐备的（如实点名）**：①引擎可用资产＝0（Godot 工程不存在，①1.7）；②切片 §8 清单内两项无产出——水墨过场概念稿 2 张（G9/S1）、3 首循环 BGM（①1.6/S7），均为 M6 前并行补件，不在开工阻塞面内，但「资产全部齐备」这句话不覆盖它们；③EA 全量余量 G1–G8 有明确触发条件、无一在切片关键路径。
- 唯一流程性硬差距是 H1（三批成品归档落账），动作量见 ③H1。

### 5.2 解冻门槛核对清单（可判定项，替代两分支论述）

**建议解冻（范围＝启动垂直切片实现 M0–M6）当且仅当以下 4 项全部打勾：**

| # | 门槛 | 判定方式 | 现状 |
|---|---|---|---|
| T1 | 三批成品已 commit＋HANDOFF 勘误包（S3）完成 | `git status docs/` 干净；HANDOFF §6.1/§5 与稿板一致 | ☑ **已达**（S3 勘误 21dba0e，含复核外新发现 2 处） |
| T2 | 用户明示解除 HANDOFF.md:4 冻结，且范围声明为「垂直切片实现」 | 用户决议记录（口头批当天入文档，bus-factor.md:18 纪律①） | ☑ **已达**（docs/resolutions/2026-10-04-unfreeze.md） |
| T3 | 承认两道门继续有效：M6 Gate 1 盲测六项指标（vertical-slice-design §10）；量产文档生效前提「Gate 1 未过全部顺延重议」（production-scope.md:5） | 解冻决议文本中写明 | ☑ **已达**（同上决议第一节第 3 条） |
| T4 | feasibility §六 三前提自查通过：**B 档团队**（＝4–5 人小队、周期 2.5–3.5 年、成本 $150k–500k，feasibility.md:69-71）且资金覆盖 ≥3 年；按 Mistria 完成度标准立项；接受 EA 长线节奏（18–24 个月迭代） | feasibility.md:123「成立前提三条，缺一不建议启动」——含人员是否在岗（①1.8 仓内无法核对，用户自查） | ☑ **已达**（用户 2026-10-04 三条逐项确认，决议第二节） |

**暂缓/不解冻的情形：**

- 意图是**跳过切片直接量产**——违反 production-scope.md:5 生效前提，不建议；
- T4 三前提任一不成立——feasibility.md:123 明文「缺一不建议启动」；
- T1 未完成——基线不明，开工即累积不可审 diff。

**通过后的第一周动作**（把「开始实现」落到可验收）：导出 spike（④技术表 T1 的成功标准）＋灰盒地图＋audio 询价发出（S7）。

### 5.3 一句话

纸面与像素侧的解冻条件已满足且账目可验收（②表 22 件＋③H1 一笔）；但引擎资产为零、音频零启动、人力现状仓外不可核对——真正的解冻条件是 T2–T4 三道用户侧签核，本文档只负责把 T1 和资产侧证据钉死。

---

## 附录 A：核对命令存档

v1.0 实跑：`ls -la docs/`；`wc -l HANDOFF.md docs/*.md docs/*.html`；`git ls-files docs/*.md`（=24）；`git status --short docs/`（2 M 1 ??）；`grep -ohE '`[a-zA-Z-]+\.md`' HANDOFF.md docs/*.md | sort -u` 逐个 `[ -f docs/$f ]`（缺失项：yearnumbers.md 笔误、runbook.md 规划件、HANDOFF.md 在根不在 docs）；`git log --diff-filter=A --format="%h %ad %s" --date=short -- <三文件>`（全部 2a90209 init 入仓）；三稿板 footer Read。

v1.1 实跑：`ls -la`（根目录无工程文件）；`find . -maxdepth 2 \( -name project.godot -o -name "*.csproj" -o -name Cargo.toml -o -name "*.xcworkspace" -o -name package.json \)`＝0 结果；`find . \( -name "*.wav" -o -name "*.ogg" -o -name "*.mp3" -o -name "*.aiff" -o -name "*.flac" \)`＝0 结果；`grep -cE '^const [A-Z]'` 三稿板＝175/133/32；`grep -cE '^const F_' docs/pixel-characters.html`＝68；`git log --name-only --format= | sort | sed 's/.*\.//' | sort | uniq -c`＝56 md/23 html/2 cjs/1 gitignore；audio-brief.md 全文读。

## 附录 B：v1.1 读稿人意见处理记录

| 意见 | 处理 |
|---|---|
| missing-工期缺位 | 新增 ④「时间量级」表：M1–M6 六个月、M18 EA，全标「排期假设」，并声明与在岗人力未核对（①1.8）联动 |
| missing-钱缺位 | 新增 ④「预算量级」表：B 档 $150k–500k、回本线、¥48k/年兼职、音频/美术未定价如实标注；「收缩多少」明确回答无法量化＋给出趋零项实据 |
| missing-人力现状 | 新增 ①1.8：仓内零人员信息，production-scope §9 是假设编制，实际在岗属仓外事实不可核对 |
| missing-引擎/代码侧 | 新增 ①1.7：Godot 工程不存在（find 0 结果）、git 全史零代码文件，解冻＝从零开始 M1 |
| missing-音频零盘点 | 新增 ①1.6＋S7：音频文件 0、切片需 3 首 BGM、报价时点 M7 与 M6 需求有一拍出入 |
| missing-资产总量级 | 新增 ①1.5：340 数组声明实点＋逐板计数，逐帧总数未解析如实标注 |
| missing-缺可判定门槛 | ⑤2 重写为 T1–T4 打勾表＋暂缓情形清单 |
| unclear-表情 15 vs 68 | ①1.1 实点裁定：F_* 数组 68＝立绘帧数，footer 错植，真值 15 型，入 S3 勘误 |
| unclear-「向兼容」 | ①1.1 改写：字面 16×32，宽 16 合口径，切帧即用，删除「兼容」措辞 |
| unclear-五件 vs +2 卡 | ①2 改写：橘梨栗茶四件 v0.7 已在板，本工作流仅新增竹 2 卡 |
| unclear-G5 过压缩 | ①1.9 G5 展开为完整裁决描述 |
| unclear-三重证法术语 | ①1.3 加术语注释（引 HANDOFF.md:50 原文并逐项释意） |
| unclear-21/22 无定论 | ②节加验收口径段：以 22 件实存清单验收，「21 件套」转 S3 勘误 |
| unclear-B 档未定义 | ⑤2 T4 内联定义（引 feasibility.md:69-71） |
| unsupported-全称矛盾 | ⑤1 改「像素设计资产齐备」并点名不齐备三项（引擎资产/水墨稿/BGM） |
| unsupported-齐备未计迁移 | ③硬差距说明段＋④T1 重写：齐备＝设计侧，引擎资产＝0 |
| unsupported-解析器跳跃 | ④T1 改「起点不是终点」，加可判定成功标准 |
| unsupported-审稿单降单点 | ④产能 P2 改：降判据漂移风险，不增人力，单点仍在，缩短恢复时间 |
| unsupported-「必错」全称 | ④技术 T3 改「防错规范非逻辑必然」，实弹 5 例 |
| unsupported-「半日」无据 | ③H1 删时间估计，改「动作量清单，未估工时」 |
