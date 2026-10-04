---
title: 星露谷人物像素设计调研（v0.3 稿板依据）
date: 2026-10-03
harness: Qoder
upstream: art-style-guide.md · pixel-characters.html
downstream: pixel-characters.html v0.3–v0.4
---

# 星露谷人物像素设计调研

> 三路并行调研汇总（规格 / 设计语言 / 小像素技法）。凡"未证实"者不进入稿板纪律，只作参考。

## 一、技术规格（有出处）

| 项 | 星露谷实测 | 我们 v0.2 | 结论 |
|---|---|---|---|
| 地图 tile | 16×16 | 16×16 | 一致 |
| 角色帧格 | **16×32**（宽 1 tile、高 2 tile） | 16×20 | **差距最大项**：我们偏矮偏 Q |
| 头身比 | ≈2.5–3 头身（16×32 内实高约 26–28px） | 2.5 头身（头 8/20=40% 头占比） | 我们头占比过高→全员幼态 |
| 行走图集 | 下/左右/上，**待机=帧0、行走 3 帧循环、左=右镜像** | 同构 | 已对齐，直接引用为背书 |
| 肤色/发型池 | 1.6 玩家 24 档肤色、74 种发型 | 2 档肤色 | 星露谷被批评肤色单一后大幅扩档——我们应一开始就拉开 |
| 描边 | 无文档级实据；目测+像素通论：**不用全黑描边，用比该物最深色再暗一档的彩色描边（选择性描边）** | 全局 K #2A 一色走天下 | **第二差距项**：黑线压平一切 |

## 二、NPC 区分度语言（设计层）

1. **三维识别矩阵**：发块剪影 × 色相族 × 一件身份道具。发块是第一识别层（Abigail 蝴蝶结紫发、Wizard 大檐帽长须、Lewis 八字胡吊带）；身份靠剪裁+道具不靠脸（Clint 铁匠围裙、Willy 烟斗、Kent 袖上军衔条）。
2. **一人一色族+点缀**：Abigail 紫+蓝、Penny 青绿+白领、Sebastian 全黑——色相族与发色**双重编码**。
3. **体型/年龄直接改剪影**：儿童矮一头（Leo）、George 轮椅、Marnie 圆润躯干、Wizard/Emily 发量体积。
4. **表情分工**：行走图**零表情**；ConcernedApe 一周年博客："为每个 NPC 画了 4 种表情（立绘），立绘是改动最多的部分"。→ 印证我们"表情只进对话特写帧"路线正确，且立绘每角色至少备 4 型。
5. **季节换装**：原版行走图不换季（只有节日帧 40–47），换季靠"发色+发型不变仍辨人"。→ 我们年集"换色不换形"是外推，保留但降调为纪律"换装动衣料色、不动发块与道具"。
6. **前车之鉴**：原版村民面孔/肤色同质、女性偏粉紫——女性角色不挂粉色族，用青/苔/月白/赭。

## 三、小像素可读性技法（可执行数值）

1. **剪影先行**：纯黑认不出是谁，上色救不回（the-pixel.art / Pixnote 同口径）——我们剪影模式即此测试，保留为闸门。
2. **明度档**：16px 级 base+1 影即够，24px+ 用 3 档（亮/中/影）。
3. **Hue-shift**：亮部往暖偏、暗部往冷偏，每档 15–20°；皮肤 10–15° 防变绿；饱和峰值在中间调。
4. **描边**：取"该物体最深色再暗一档"，禁纯黑一色；受光侧可断线（选择性描边）。
5. **行走帧**：4 帧制 contact/down/passing/up、每帧 100–150ms；2 帧换腿需前后脚错位 1–2px+接地微沉；idle 1px bob。
6. **腿 ≥2px** 否则缩放后碎；发型外轮廓凸出 ≥2px 才读得出（后者未证实，按经验执行）。

## 四、v0.3 改造清单（本调研的直接应用）

1. **帧格 16×20 → 16×32**（对齐星露谷硬规格：宽 1 tile 高 2 tile）；头+发压到 ~10 行，躯干 9–10，腿+靴 8——头占比 40%→31%，全员脱离幼态。
2. **一笔墨一色线**：全局 K 描边废除，改**工笔多色线**——线取本料暗色（靛线 c、苔线 d、灰线 z、肤线 s、发线 K），白物用淡墨 k。考据自洽：工笔白描本就有 墨线/赭线/青墨线 分工，不是照抄星露谷而是回到我们自己的画种传统。
3. **三色阶衣料**：每角色主衣 亮/中/影 三档（新增高光键 v/j/m、暗线键 z/y/o/t/g），受光侧亮线、背光侧暗线。
4. **发色双重编码**：新增 褐发 f #6B4A34、灰白发（用 N/W）、发丝高光 Z——八人发块不再同色同形。
5. **女性不挂粉**：小满桃夭 p 降为点缀（发带/滚边），主衣改靛青 u；桂珍月白+苔绿。
6. **行走 3 帧升级为 4 帧制**（contact/下沉/通过/抬起，260ms→120ms/帧），待机仍=行走帧0。
7. **表情纪律背书**：对话特写 5 型 → 对齐星露谷"每 NPC 4 表情立绘"，写进稿板说明。
8. 远景测试/年集/剪影三工具保留——它们与调研结论互相印证。

## 来源

- [Modding:Maps](https://stardewvalleywiki.com/Modding:Maps) · [模组:玩家贴图](https://zh.stardewvalleywiki.com/模组:玩家贴图) · [Modding:NPC data](https://stardewvalleywiki.com/Modding:NPC_data) · [The_Player](https://stardewvalleywiki.com/The_Player)
- [ConcernedApe 一周年博客（4 表情立绘）](https://www.stardewvalley.net/stardew-valley-1-year-anniversary/)
- Wiki 角色页：Abigail / Marnie / George / Evelyn / Willy / Lewis / Clint / Kent / Penny / Sebastian / Wizard / Leo
- [the-pixel.art：character design / hue shifting / selective outlining / walk cycle](https://the-pixel.art/articles/pixel-art-character-design/) · [Pixnote：character/shading/animation](https://pixnote.net/en/learn/character/) · [Lospec 教程索引](https://lospec.com/pixel-art-tutorials)
