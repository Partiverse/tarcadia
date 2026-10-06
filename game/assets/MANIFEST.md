# game/assets/MANIFEST.md

由 `tools/board2godot.mjs` 确定性导出，**勿手改**；重跑 `node tools/board2godot.mjs` 再生；`node tools/board2godot.mjs --verify` 复核（重解析→重导出到临时目录→与本目录逐字节比对＋全部 PNG 洋红 #FF00FF 计数＋帧数对本清单，任何出入 exit 非 0）。

- 数据段口径：稿板 `<script>` 内 `/* ===== 渲染器` 锚之前、`const NAME=[…]` 且首元素为字符串（audit 同款判据；渲染段与 CAST/FACES_*/ICONS/TILES/TREES 等对象表跳过）。
- audit 最新输出（宽/行数/色键 PASS）：characters 145 ＋ world 111 ＋ phenology 24 ＝ 280 个像素数组。
- 本清单实迁 285 个数组＝633 帧 PNG：world 较 audit 多 5 个（W_RAIN_A/B、W_SNOW_A/B、W_FOG——audit 原正则 `=\[` 不容 `=` 与 `[` 间换行而漏数其换行声明，本工具修正补齐）。
- 未导出说明：characters 渲染段 `WALKROWS_M/F/J` 为 `withRows(体, 腿段)` 运行时合成帧非手排矩阵，行走动画由引擎以 `*_SIDE`＋`SIDE_OPEN_*` 同语义合成；world 渲染段 `AUTO_DEMO/AUTO_DEMO2` 为 autotile 演示家族掩码（键＝地块家族码非色板键）。均不属像素资产。
- 色板绑定：characters=`PAL`；world=`SEASON_PALS` 四季同构换色（每数组 4 帧 `_spring/_summer/_autumn/_winter`）；phenology=`ICONS[].season` 本季色板（`.`＝透明，即留白透宣纸）。
- 洋红哲学：未登记色键在导出期硬失败（exit 非 0、指明数组与字符、不猜色）；迁移产物中 #FF00FF 像素必须为 0（--verify 强制）。

汇总：数组 285 ｜ 帧 PNG 633 ｜ 派生资源 11（atlas×4＋TileSet×4＋SpriteFrames×3）｜ 文件合计 645

## characters（docs/pixel-characters.html，145 个数组）

| 数组 | 稿板 | 尺寸 | 帧数 | 文件 | 色板 | 来源稿板 |
|---|---|---|---|---|---|---|
| MALE | characters | 16x32 | 1 | sprites/characters/MALE.png | PAL | docs/pixel-characters.html |
| WALK2 | characters | 16x29 | 1 | sprites/characters/WALK2.png | PAL | docs/pixel-characters.html |
| FEMALE | characters | 16x32 | 1 | sprites/characters/FEMALE.png | PAL | docs/pixel-characters.html |
| DEHOU | characters | 16x32 | 1 | sprites/characters/DEHOU.png | PAL | docs/pixel-characters.html |
| GUIZHEN | characters | 16x32 | 1 | sprites/characters/GUIZHEN.png | PAL | docs/pixel-characters.html |
| DASHAN | characters | 16x32 | 1 | sprites/characters/DASHAN.png | PAL | docs/pixel-characters.html |
| XIAOMAN | characters | 16x32 | 1 | sprites/characters/XIAOMAN.png | PAL | docs/pixel-characters.html |
| CHENGLU | characters | 16x32 | 1 | sprites/characters/CHENGLU.png | PAL | docs/pixel-characters.html |
| JIANGKE | characters | 16x32 | 1 | sprites/characters/JIANGKE.png | PAL | docs/pixel-characters.html |
| MALE_SIDE | characters | 16x32 | 1 | sprites/characters/MALE_SIDE.png | PAL | docs/pixel-characters.html |
| FEMALE_SIDE | characters | 16x32 | 1 | sprites/characters/FEMALE_SIDE.png | PAL | docs/pixel-characters.html |
| DEHOU_SIDE | characters | 16x32 | 1 | sprites/characters/DEHOU_SIDE.png | PAL | docs/pixel-characters.html |
| GUIZHEN_SIDE | characters | 16x32 | 1 | sprites/characters/GUIZHEN_SIDE.png | PAL | docs/pixel-characters.html |
| DASHAN_SIDE | characters | 16x32 | 1 | sprites/characters/DASHAN_SIDE.png | PAL | docs/pixel-characters.html |
| XIAOMAN_SIDE | characters | 16x32 | 1 | sprites/characters/XIAOMAN_SIDE.png | PAL | docs/pixel-characters.html |
| CHENGLU_SIDE | characters | 16x32 | 1 | sprites/characters/CHENGLU_SIDE.png | PAL | docs/pixel-characters.html |
| JIANGKE_SIDE | characters | 16x32 | 1 | sprites/characters/JIANGKE_SIDE.png | PAL | docs/pixel-characters.html |
| SIDE_OPEN_M | characters | 16x6 | 1 | sprites/characters/SIDE_OPEN_M.png | PAL | docs/pixel-characters.html |
| SIDE_OPEN_F | characters | 16x6 | 1 | sprites/characters/SIDE_OPEN_F.png | PAL | docs/pixel-characters.html |
| SIDE_OPEN_J | characters | 16x5 | 1 | sprites/characters/SIDE_OPEN_J.png | PAL | docs/pixel-characters.html |
| MALE_BACK | characters | 16x32 | 1 | sprites/characters/MALE_BACK.png | PAL | docs/pixel-characters.html |
| FEMALE_BACK | characters | 16x32 | 1 | sprites/characters/FEMALE_BACK.png | PAL | docs/pixel-characters.html |
| DEHOU_BACK | characters | 16x32 | 1 | sprites/characters/DEHOU_BACK.png | PAL | docs/pixel-characters.html |
| GUIZHEN_BACK | characters | 16x32 | 1 | sprites/characters/GUIZHEN_BACK.png | PAL | docs/pixel-characters.html |
| DASHAN_BACK | characters | 16x32 | 1 | sprites/characters/DASHAN_BACK.png | PAL | docs/pixel-characters.html |
| XIAOMAN_BACK | characters | 16x32 | 1 | sprites/characters/XIAOMAN_BACK.png | PAL | docs/pixel-characters.html |
| CHENGLU_BACK | characters | 16x32 | 1 | sprites/characters/CHENGLU_BACK.png | PAL | docs/pixel-characters.html |
| JIANGKE_BACK | characters | 16x32 | 1 | sprites/characters/JIANGKE_BACK.png | PAL | docs/pixel-characters.html |
| XIUCAI | characters | 16x32 | 1 | sprites/characters/XIUCAI.png | PAL | docs/pixel-characters.html |
| XIUCAI_SIDE | characters | 16x32 | 1 | sprites/characters/XIUCAI_SIDE.png | PAL | docs/pixel-characters.html |
| XIUCAI_BACK | characters | 16x32 | 1 | sprites/characters/XIUCAI_BACK.png | PAL | docs/pixel-characters.html |
| SHEHUO | characters | 16x32 | 1 | sprites/characters/SHEHUO.png | PAL | docs/pixel-characters.html |
| SHEHUO_SIDE | characters | 16x32 | 1 | sprites/characters/SHEHUO_SIDE.png | PAL | docs/pixel-characters.html |
| SHEHUO_BACK | characters | 16x32 | 1 | sprites/characters/SHEHUO_BACK.png | PAL | docs/pixel-characters.html |
| YAQIN | characters | 16x32 | 1 | sprites/characters/YAQIN.png | PAL | docs/pixel-characters.html |
| YAQIN_SIDE | characters | 16x32 | 1 | sprites/characters/YAQIN_SIDE.png | PAL | docs/pixel-characters.html |
| YAQIN_BACK | characters | 16x32 | 1 | sprites/characters/YAQIN_BACK.png | PAL | docs/pixel-characters.html |
| CHENGYE | characters | 16x32 | 1 | sprites/characters/CHENGYE.png | PAL | docs/pixel-characters.html |
| CHENGYE_SIDE | characters | 16x32 | 1 | sprites/characters/CHENGYE_SIDE.png | PAL | docs/pixel-characters.html |
| CHENGYE_BACK | characters | 16x32 | 1 | sprites/characters/CHENGYE_BACK.png | PAL | docs/pixel-characters.html |
| XIAOLU | characters | 16x32 | 1 | sprites/characters/XIAOLU.png | PAL | docs/pixel-characters.html |
| XIAOLU_SIDE | characters | 16x32 | 1 | sprites/characters/XIAOLU_SIDE.png | PAL | docs/pixel-characters.html |
| XIAOLU_BACK | characters | 16x32 | 1 | sprites/characters/XIAOLU_BACK.png | PAL | docs/pixel-characters.html |
| CHUNXIANG | characters | 16x32 | 1 | sprites/characters/CHUNXIANG.png | PAL | docs/pixel-characters.html |
| CHUNXIANG_SIDE | characters | 16x32 | 1 | sprites/characters/CHUNXIANG_SIDE.png | PAL | docs/pixel-characters.html |
| CHUNXIANG_BACK | characters | 16x32 | 1 | sprites/characters/CHUNXIANG_BACK.png | PAL | docs/pixel-characters.html |
| HUOLANG | characters | 16x32 | 1 | sprites/characters/HUOLANG.png | PAL | docs/pixel-characters.html |
| HUOLANG_SIDE | characters | 16x32 | 1 | sprites/characters/HUOLANG_SIDE.png | PAL | docs/pixel-characters.html |
| HUOLANG_BACK | characters | 16x32 | 1 | sprites/characters/HUOLANG_BACK.png | PAL | docs/pixel-characters.html |
| LIEHU | characters | 16x32 | 1 | sprites/characters/LIEHU.png | PAL | docs/pixel-characters.html |
| LIEHU_SIDE | characters | 16x32 | 1 | sprites/characters/LIEHU_SIDE.png | PAL | docs/pixel-characters.html |
| LIEHU_BACK | characters | 16x32 | 1 | sprites/characters/LIEHU_BACK.png | PAL | docs/pixel-characters.html |
| ZHOUMAN | characters | 16x32 | 1 | sprites/characters/ZHOUMAN.png | PAL | docs/pixel-characters.html |
| ZHOUMAN_SIDE | characters | 16x32 | 1 | sprites/characters/ZHOUMAN_SIDE.png | PAL | docs/pixel-characters.html |
| ZHOUMAN_BACK | characters | 16x32 | 1 | sprites/characters/ZHOUMAN_BACK.png | PAL | docs/pixel-characters.html |
| TIESHENG | characters | 16x32 | 1 | sprites/characters/TIESHENG.png | PAL | docs/pixel-characters.html |
| TIESHENG_SIDE | characters | 16x32 | 1 | sprites/characters/TIESHENG_SIDE.png | PAL | docs/pixel-characters.html |
| TIESHENG_BACK | characters | 16x32 | 1 | sprites/characters/TIESHENG_BACK.png | PAL | docs/pixel-characters.html |
| HOE_A | characters | 16x32 | 1 | sprites/characters/HOE_A.png | PAL | docs/pixel-characters.html |
| HOE_B | characters | 16x32 | 1 | sprites/characters/HOE_B.png | PAL | docs/pixel-characters.html |
| HOE_C | characters | 16x32 | 1 | sprites/characters/HOE_C.png | PAL | docs/pixel-characters.html |
| CAN_A | characters | 16x32 | 1 | sprites/characters/CAN_A.png | PAL | docs/pixel-characters.html |
| CAN_B | characters | 16x32 | 1 | sprites/characters/CAN_B.png | PAL | docs/pixel-characters.html |
| CAN_C | characters | 16x32 | 1 | sprites/characters/CAN_C.png | PAL | docs/pixel-characters.html |
| SICKLE_A | characters | 16x32 | 1 | sprites/characters/SICKLE_A.png | PAL | docs/pixel-characters.html |
| SICKLE_B | characters | 16x32 | 1 | sprites/characters/SICKLE_B.png | PAL | docs/pixel-characters.html |
| SICKLE_C | characters | 16x32 | 1 | sprites/characters/SICKLE_C.png | PAL | docs/pixel-characters.html |
| AXE_A | characters | 16x32 | 1 | sprites/characters/AXE_A.png | PAL | docs/pixel-characters.html |
| AXE_B | characters | 16x32 | 1 | sprites/characters/AXE_B.png | PAL | docs/pixel-characters.html |
| AXE_C | characters | 16x32 | 1 | sprites/characters/AXE_C.png | PAL | docs/pixel-characters.html |
| ROD_A | characters | 16x32 | 1 | sprites/characters/ROD_A.png | PAL | docs/pixel-characters.html |
| ROD_B | characters | 16x32 | 1 | sprites/characters/ROD_B.png | PAL | docs/pixel-characters.html |
| ROD_C | characters | 16x32 | 1 | sprites/characters/ROD_C.png | PAL | docs/pixel-characters.html |
| F_M_BASE | characters | 16x16 | 1 | sprites/characters/F_M_BASE.png | PAL | docs/pixel-characters.html |
| F_M_JOY | characters | 16x16 | 1 | sprites/characters/F_M_JOY.png | PAL | docs/pixel-characters.html |
| F_M_SAD | characters | 16x16 | 1 | sprites/characters/F_M_SAD.png | PAL | docs/pixel-characters.html |
| F_M_ANG | characters | 16x16 | 1 | sprites/characters/F_M_ANG.png | PAL | docs/pixel-characters.html |
| F_M_SHY | characters | 16x16 | 1 | sprites/characters/F_M_SHY.png | PAL | docs/pixel-characters.html |
| F_J_BASE | characters | 16x16 | 1 | sprites/characters/F_J_BASE.png | PAL | docs/pixel-characters.html |
| F_J_SMILE | characters | 16x16 | 1 | sprites/characters/F_J_SMILE.png | PAL | docs/pixel-characters.html |
| F_J_STERN | characters | 16x16 | 1 | sprites/characters/F_J_STERN.png | PAL | docs/pixel-characters.html |
| F_F_BASE | characters | 16x16 | 1 | sprites/characters/F_F_BASE.png | PAL | docs/pixel-characters.html |
| F_F_JOY | characters | 16x16 | 1 | sprites/characters/F_F_JOY.png | PAL | docs/pixel-characters.html |
| F_F_ANG | characters | 16x16 | 1 | sprites/characters/F_F_ANG.png | PAL | docs/pixel-characters.html |
| F_D_ANG | characters | 16x16 | 1 | sprites/characters/F_D_ANG.png | PAL | docs/pixel-characters.html |
| F_G_JOY | characters | 16x16 | 1 | sprites/characters/F_G_JOY.png | PAL | docs/pixel-characters.html |
| F_DS_TIRED | characters | 16x16 | 1 | sprites/characters/F_DS_TIRED.png | PAL | docs/pixel-characters.html |
| F_X_SHY | characters | 16x16 | 1 | sprites/characters/F_X_SHY.png | PAL | docs/pixel-characters.html |
| F_D_CALM | characters | 16x16 | 1 | sprites/characters/F_D_CALM.png | PAL | docs/pixel-characters.html |
| F_D_JOY | characters | 16x16 | 1 | sprites/characters/F_D_JOY.png | PAL | docs/pixel-characters.html |
| F_D_SAD | characters | 16x16 | 1 | sprites/characters/F_D_SAD.png | PAL | docs/pixel-characters.html |
| F_G_CALM | characters | 16x16 | 1 | sprites/characters/F_G_CALM.png | PAL | docs/pixel-characters.html |
| F_G_ANG | characters | 16x16 | 1 | sprites/characters/F_G_ANG.png | PAL | docs/pixel-characters.html |
| F_G_SAD | characters | 16x16 | 1 | sprites/characters/F_G_SAD.png | PAL | docs/pixel-characters.html |
| F_DS_CALM | characters | 16x16 | 1 | sprites/characters/F_DS_CALM.png | PAL | docs/pixel-characters.html |
| F_DS_JOY | characters | 16x16 | 1 | sprites/characters/F_DS_JOY.png | PAL | docs/pixel-characters.html |
| F_DS_ANG | characters | 16x16 | 1 | sprites/characters/F_DS_ANG.png | PAL | docs/pixel-characters.html |
| F_X_CALM | characters | 16x16 | 1 | sprites/characters/F_X_CALM.png | PAL | docs/pixel-characters.html |
| F_X_JOY | characters | 16x16 | 1 | sprites/characters/F_X_JOY.png | PAL | docs/pixel-characters.html |
| F_X_SAD | characters | 16x16 | 1 | sprites/characters/F_X_SAD.png | PAL | docs/pixel-characters.html |
| F_J_CALM | characters | 16x16 | 1 | sprites/characters/F_J_CALM.png | PAL | docs/pixel-characters.html |
| F_XC_CALM | characters | 16x16 | 1 | sprites/characters/F_XC_CALM.png | PAL | docs/pixel-characters.html |
| F_XC_JOY | characters | 16x16 | 1 | sprites/characters/F_XC_JOY.png | PAL | docs/pixel-characters.html |
| F_XC_SAD | characters | 16x16 | 1 | sprites/characters/F_XC_SAD.png | PAL | docs/pixel-characters.html |
| F_XC_THINK | characters | 16x16 | 1 | sprites/characters/F_XC_THINK.png | PAL | docs/pixel-characters.html |
| F_SHE_CALM | characters | 16x16 | 1 | sprites/characters/F_SHE_CALM.png | PAL | docs/pixel-characters.html |
| F_SHE_JOY | characters | 16x16 | 1 | sprites/characters/F_SHE_JOY.png | PAL | docs/pixel-characters.html |
| F_SHE_SAD | characters | 16x16 | 1 | sprites/characters/F_SHE_SAD.png | PAL | docs/pixel-characters.html |
| F_SHE_ANG | characters | 16x16 | 1 | sprites/characters/F_SHE_ANG.png | PAL | docs/pixel-characters.html |
| F_YQ_CALM | characters | 16x16 | 1 | sprites/characters/F_YQ_CALM.png | PAL | docs/pixel-characters.html |
| F_YQ_JOY | characters | 16x16 | 1 | sprites/characters/F_YQ_JOY.png | PAL | docs/pixel-characters.html |
| F_YQ_SAD | characters | 16x16 | 1 | sprites/characters/F_YQ_SAD.png | PAL | docs/pixel-characters.html |
| F_YQ_ANG | characters | 16x16 | 1 | sprites/characters/F_YQ_ANG.png | PAL | docs/pixel-characters.html |
| F_CY_CALM | characters | 16x16 | 1 | sprites/characters/F_CY_CALM.png | PAL | docs/pixel-characters.html |
| F_CY_JOY | characters | 16x16 | 1 | sprites/characters/F_CY_JOY.png | PAL | docs/pixel-characters.html |
| F_CY_SAD | characters | 16x16 | 1 | sprites/characters/F_CY_SAD.png | PAL | docs/pixel-characters.html |
| F_CY_ANG | characters | 16x16 | 1 | sprites/characters/F_CY_ANG.png | PAL | docs/pixel-characters.html |
| F_XL_CALM | characters | 16x16 | 1 | sprites/characters/F_XL_CALM.png | PAL | docs/pixel-characters.html |
| F_XL_JOY | characters | 16x16 | 1 | sprites/characters/F_XL_JOY.png | PAL | docs/pixel-characters.html |
| F_XL_SAD | characters | 16x16 | 1 | sprites/characters/F_XL_SAD.png | PAL | docs/pixel-characters.html |
| F_XL_ANG | characters | 16x16 | 1 | sprites/characters/F_XL_ANG.png | PAL | docs/pixel-characters.html |
| F_CX_CALM | characters | 16x16 | 1 | sprites/characters/F_CX_CALM.png | PAL | docs/pixel-characters.html |
| F_CX_JOY | characters | 16x16 | 1 | sprites/characters/F_CX_JOY.png | PAL | docs/pixel-characters.html |
| F_CX_SAD | characters | 16x16 | 1 | sprites/characters/F_CX_SAD.png | PAL | docs/pixel-characters.html |
| F_CX_ANG | characters | 16x16 | 1 | sprites/characters/F_CX_ANG.png | PAL | docs/pixel-characters.html |
| F_HS_CALM | characters | 16x16 | 1 | sprites/characters/F_HS_CALM.png | PAL | docs/pixel-characters.html |
| F_HS_JOY | characters | 16x16 | 1 | sprites/characters/F_HS_JOY.png | PAL | docs/pixel-characters.html |
| F_HS_SAD | characters | 16x16 | 1 | sprites/characters/F_HS_SAD.png | PAL | docs/pixel-characters.html |
| F_HS_ANG | characters | 16x16 | 1 | sprites/characters/F_HS_ANG.png | PAL | docs/pixel-characters.html |
| F_SHS_CALM | characters | 16x16 | 1 | sprites/characters/F_SHS_CALM.png | PAL | docs/pixel-characters.html |
| F_SHS_JOY | characters | 16x16 | 1 | sprites/characters/F_SHS_JOY.png | PAL | docs/pixel-characters.html |
| F_SHS_SAD | characters | 16x16 | 1 | sprites/characters/F_SHS_SAD.png | PAL | docs/pixel-characters.html |
| F_SHS_ANG | characters | 16x16 | 1 | sprites/characters/F_SHS_ANG.png | PAL | docs/pixel-characters.html |
| F_ZM_CALM | characters | 16x16 | 1 | sprites/characters/F_ZM_CALM.png | PAL | docs/pixel-characters.html |
| F_ZM_JOY | characters | 16x16 | 1 | sprites/characters/F_ZM_JOY.png | PAL | docs/pixel-characters.html |
| F_ZM_SAD | characters | 16x16 | 1 | sprites/characters/F_ZM_SAD.png | PAL | docs/pixel-characters.html |
| F_ZM_ANG | characters | 16x16 | 1 | sprites/characters/F_ZM_ANG.png | PAL | docs/pixel-characters.html |
| F_TS_CALM | characters | 16x16 | 1 | sprites/characters/F_TS_CALM.png | PAL | docs/pixel-characters.html |
| F_TS_JOY | characters | 16x16 | 1 | sprites/characters/F_TS_JOY.png | PAL | docs/pixel-characters.html |
| F_TS_SAD | characters | 16x16 | 1 | sprites/characters/F_TS_SAD.png | PAL | docs/pixel-characters.html |
| F_TS_ANG | characters | 16x16 | 1 | sprites/characters/F_TS_ANG.png | PAL | docs/pixel-characters.html |
| HONGTAO | characters | 16x16 | 1 | sprites/characters/HONGTAO.png | PAL | docs/pixel-characters.html |
| BANLIANG | characters | 16x16 | 1 | sprites/characters/BANLIANG.png | PAL | docs/pixel-characters.html |
| YAOLOU | characters | 16x16 | 1 | sprites/characters/YAOLOU.png | PAL | docs/pixel-characters.html |
| GUAYU | characters | 16x16 | 1 | sprites/characters/GUAYU.png | PAL | docs/pixel-characters.html |

## world（docs/pixel-world.html，116 个数组）

| 数组 | 稿板 | 尺寸 | 帧数 | 文件 | 色板 | 来源稿板 |
|---|---|---|---|---|---|---|
| T_WILD | world | 16x16 | 4 | sprites/world/T_WILD_spring.png、sprites/world/T_WILD_summer.png、sprites/world/T_WILD_autumn.png、sprites/world/T_WILD_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_TILLED | world | 16x16 | 4 | sprites/world/T_TILLED_spring.png、sprites/world/T_TILLED_summer.png、sprites/world/T_TILLED_autumn.png、sprites/world/T_TILLED_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_WET | world | 16x16 | 4 | sprites/world/T_WET_spring.png、sprites/world/T_WET_summer.png、sprites/world/T_WET_autumn.png、sprites/world/T_WET_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_PADDY | world | 16x16 | 4 | sprites/world/T_PADDY_spring.png、sprites/world/T_PADDY_summer.png、sprites/world/T_PADDY_autumn.png、sprites/world/T_PADDY_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_RIDGE | world | 16x16 | 4 | sprites/world/T_RIDGE_spring.png、sprites/world/T_RIDGE_summer.png、sprites/world/T_RIDGE_autumn.png、sprites/world/T_RIDGE_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_PATHD | world | 16x16 | 4 | sprites/world/T_PATHD_spring.png、sprites/world/T_PATHD_summer.png、sprites/world/T_PATHD_autumn.png、sprites/world/T_PATHD_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_PATHS | world | 16x16 | 4 | sprites/world/T_PATHS_spring.png、sprites/world/T_PATHS_summer.png、sprites/world/T_PATHS_autumn.png、sprites/world/T_PATHS_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_GRASS | world | 16x16 | 4 | sprites/world/T_GRASS_spring.png、sprites/world/T_GRASS_summer.png、sprites/world/T_GRASS_autumn.png、sprites/world/T_GRASS_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_FLOWER | world | 16x16 | 4 | sprites/world/T_FLOWER_spring.png、sprites/world/T_FLOWER_summer.png、sprites/world/T_FLOWER_autumn.png、sprites/world/T_FLOWER_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_WATERC | world | 16x16 | 4 | sprites/world/T_WATERC_spring.png、sprites/world/T_WATERC_summer.png、sprites/world/T_WATERC_autumn.png、sprites/world/T_WATERC_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_WATERR | world | 16x16 | 4 | sprites/world/T_WATERR_spring.png、sprites/world/T_WATERR_summer.png、sprites/world/T_WATERR_autumn.png、sprites/world/T_WATERR_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| T_TERRACE | world | 16x16 | 4 | sprites/world/T_TERRACE_spring.png、sprites/world/T_TERRACE_summer.png、sprites/world/T_TERRACE_autumn.png、sprites/world/T_TERRACE_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_CU_1 | world | 16x16 | 4 | sprites/world/C_CU_1_spring.png、sprites/world/C_CU_1_summer.png、sprites/world/C_CU_1_autumn.png、sprites/world/C_CU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_CU_2 | world | 16x16 | 4 | sprites/world/C_CU_2_spring.png、sprites/world/C_CU_2_summer.png、sprites/world/C_CU_2_autumn.png、sprites/world/C_CU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_CU_3 | world | 16x16 | 4 | sprites/world/C_CU_3_spring.png、sprites/world/C_CU_3_summer.png、sprites/world/C_CU_3_autumn.png、sprites/world/C_CU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_CU_4 | world | 16x16 | 4 | sprites/world/C_CU_4_spring.png、sprites/world/C_CU_4_summer.png、sprites/world/C_CU_4_autumn.png、sprites/world/C_CU_4_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_BN_1 | world | 16x16 | 4 | sprites/world/C_BN_1_spring.png、sprites/world/C_BN_1_summer.png、sprites/world/C_BN_1_autumn.png、sprites/world/C_BN_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_BN_2 | world | 16x16 | 4 | sprites/world/C_BN_2_spring.png、sprites/world/C_BN_2_summer.png、sprites/world/C_BN_2_autumn.png、sprites/world/C_BN_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_BN_3 | world | 16x16 | 4 | sprites/world/C_BN_3_spring.png、sprites/world/C_BN_3_summer.png、sprites/world/C_BN_3_autumn.png、sprites/world/C_BN_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_BN_4 | world | 16x16 | 4 | sprites/world/C_BN_4_spring.png、sprites/world/C_BN_4_summer.png、sprites/world/C_BN_4_autumn.png、sprites/world/C_BN_4_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_RC_1 | world | 16x16 | 4 | sprites/world/C_RC_1_spring.png、sprites/world/C_RC_1_summer.png、sprites/world/C_RC_1_autumn.png、sprites/world/C_RC_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_RC_2 | world | 16x16 | 4 | sprites/world/C_RC_2_spring.png、sprites/world/C_RC_2_summer.png、sprites/world/C_RC_2_autumn.png、sprites/world/C_RC_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_RC_3 | world | 16x16 | 4 | sprites/world/C_RC_3_spring.png、sprites/world/C_RC_3_summer.png、sprites/world/C_RC_3_autumn.png、sprites/world/C_RC_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| C_RC_4 | world | 16x16 | 4 | sprites/world/C_RC_4_spring.png、sprites/world/C_RC_4_summer.png、sprites/world/C_RC_4_autumn.png、sprites/world/C_RC_4_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ITEM_CU | world | 16x16 | 4 | sprites/world/ITEM_CU_spring.png、sprites/world/ITEM_CU_summer.png、sprites/world/ITEM_CU_autumn.png、sprites/world/ITEM_CU_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ITEM_BN | world | 16x16 | 4 | sprites/world/ITEM_BN_spring.png、sprites/world/ITEM_BN_summer.png、sprites/world/ITEM_BN_autumn.png、sprites/world/ITEM_BN_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ITEM_RC | world | 16x16 | 4 | sprites/world/ITEM_RC_spring.png、sprites/world/ITEM_RC_summer.png、sprites/world/ITEM_RC_autumn.png、sprites/world/ITEM_RC_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_A | world | 32x32 | 4 | sprites/world/B_HOUSE_A_spring.png、sprites/world/B_HOUSE_A_summer.png、sprites/world/B_HOUSE_A_autumn.png、sprites/world/B_HOUSE_A_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_B | world | 32x32 | 4 | sprites/world/B_HOUSE_B_spring.png、sprites/world/B_HOUSE_B_summer.png、sprites/world/B_HOUSE_B_autumn.png、sprites/world/B_HOUSE_B_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HALL_F | world | 48x32 | 4 | sprites/world/B_HALL_F_spring.png、sprites/world/B_HALL_F_summer.png、sprites/world/B_HALL_F_autumn.png、sprites/world/B_HALL_F_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HALL_S | world | 32x32 | 4 | sprites/world/B_HALL_S_spring.png、sprites/world/B_HALL_S_summer.png、sprites/world/B_HALL_S_autumn.png、sprites/world/B_HALL_S_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_A2 | world | 32x32 | 4 | sprites/world/B_HOUSE_A2_spring.png、sprites/world/B_HOUSE_A2_summer.png、sprites/world/B_HOUSE_A2_autumn.png、sprites/world/B_HOUSE_A2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_A3 | world | 32x32 | 4 | sprites/world/B_HOUSE_A3_spring.png、sprites/world/B_HOUSE_A3_summer.png、sprites/world/B_HOUSE_A3_autumn.png、sprites/world/B_HOUSE_A3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_A4 | world | 32x32 | 4 | sprites/world/B_HOUSE_A4_spring.png、sprites/world/B_HOUSE_A4_summer.png、sprites/world/B_HOUSE_A4_autumn.png、sprites/world/B_HOUSE_A4_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_B2 | world | 32x32 | 4 | sprites/world/B_HOUSE_B2_spring.png、sprites/world/B_HOUSE_B2_summer.png、sprites/world/B_HOUSE_B2_autumn.png、sprites/world/B_HOUSE_B2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_HOUSE_D | world | 48x32 | 4 | sprites/world/B_HOUSE_D_spring.png、sprites/world/B_HOUSE_D_summer.png、sprites/world/B_HOUSE_D_autumn.png、sprites/world/B_HOUSE_D_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_SHOP | world | 32x32 | 4 | sprites/world/B_SHOP_spring.png、sprites/world/B_SHOP_summer.png、sprites/world/B_SHOP_autumn.png、sprites/world/B_SHOP_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| B_GALLERY | world | 32x32 | 4 | sprites/world/B_GALLERY_spring.png、sprites/world/B_GALLERY_summer.png、sprites/world/B_GALLERY_autumn.png、sprites/world/B_GALLERY_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SEZA_1 | world | 16x16 | 4 | sprites/world/SEZA_1_spring.png、sprites/world/SEZA_1_summer.png、sprites/world/SEZA_1_autumn.png、sprites/world/SEZA_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SEZA_2 | world | 16x16 | 4 | sprites/world/SEZA_2_spring.png、sprites/world/SEZA_2_summer.png、sprites/world/SEZA_2_autumn.png、sprites/world/SEZA_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SEZA_3 | world | 16x16 | 4 | sprites/world/SEZA_3_spring.png、sprites/world/SEZA_3_summer.png、sprites/world/SEZA_3_autumn.png、sprites/world/SEZA_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DADOU_1 | world | 16x16 | 4 | sprites/world/DADOU_1_spring.png、sprites/world/DADOU_1_summer.png、sprites/world/DADOU_1_autumn.png、sprites/world/DADOU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DADOU_2 | world | 16x16 | 4 | sprites/world/DADOU_2_spring.png、sprites/world/DADOU_2_summer.png、sprites/world/DADOU_2_autumn.png、sprites/world/DADOU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DADOU_3 | world | 16x16 | 4 | sprites/world/DADOU_3_spring.png、sprites/world/DADOU_3_summer.png、sprites/world/DADOU_3_autumn.png、sprites/world/DADOU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DONGGUA_1 | world | 16x16 | 4 | sprites/world/DONGGUA_1_spring.png、sprites/world/DONGGUA_1_summer.png、sprites/world/DONGGUA_1_autumn.png、sprites/world/DONGGUA_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DONGGUA_2 | world | 16x16 | 4 | sprites/world/DONGGUA_2_spring.png、sprites/world/DONGGUA_2_summer.png、sprites/world/DONGGUA_2_autumn.png、sprites/world/DONGGUA_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| DONGGUA_3 | world | 16x16 | 4 | sprites/world/DONGGUA_3_spring.png、sprites/world/DONGGUA_3_summer.png、sprites/world/DONGGUA_3_autumn.png、sprites/world/DONGGUA_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| XIGUA_1 | world | 16x16 | 4 | sprites/world/XIGUA_1_spring.png、sprites/world/XIGUA_1_summer.png、sprites/world/XIGUA_1_autumn.png、sprites/world/XIGUA_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| XIGUA_2 | world | 16x16 | 4 | sprites/world/XIGUA_2_spring.png、sprites/world/XIGUA_2_summer.png、sprites/world/XIGUA_2_autumn.png、sprites/world/XIGUA_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| XIGUA_3 | world | 16x16 | 4 | sprites/world/XIGUA_3_spring.png、sprites/world/XIGUA_3_summer.png、sprites/world/XIGUA_3_autumn.png、sprites/world/XIGUA_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIE_1 | world | 16x16 | 4 | sprites/world/QIE_1_spring.png、sprites/world/QIE_1_summer.png、sprites/world/QIE_1_autumn.png、sprites/world/QIE_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIE_2 | world | 16x16 | 4 | sprites/world/QIE_2_spring.png、sprites/world/QIE_2_summer.png、sprites/world/QIE_2_autumn.png、sprites/world/QIE_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIE_3 | world | 16x16 | 4 | sprites/world/QIE_3_spring.png、sprites/world/QIE_3_summer.png、sprites/world/QIE_3_autumn.png、sprites/world/QIE_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LIAN_1 | world | 16x16 | 4 | sprites/world/LIAN_1_spring.png、sprites/world/LIAN_1_summer.png、sprites/world/LIAN_1_autumn.png、sprites/world/LIAN_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LIAN_2 | world | 16x16 | 4 | sprites/world/LIAN_2_spring.png、sprites/world/LIAN_2_summer.png、sprites/world/LIAN_2_autumn.png、sprites/world/LIAN_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LIAN_3 | world | 16x16 | 4 | sprites/world/LIAN_3_spring.png、sprites/world/LIAN_3_summer.png、sprites/world/LIAN_3_autumn.png、sprites/world/LIAN_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JIANG_1 | world | 16x16 | 4 | sprites/world/JIANG_1_spring.png、sprites/world/JIANG_1_summer.png、sprites/world/JIANG_1_autumn.png、sprites/world/JIANG_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JIANG_2 | world | 16x16 | 4 | sprites/world/JIANG_2_spring.png、sprites/world/JIANG_2_summer.png、sprites/world/JIANG_2_autumn.png、sprites/world/JIANG_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JIANG_3 | world | 16x16 | 4 | sprites/world/JIANG_3_spring.png、sprites/world/JIANG_3_summer.png、sprites/world/JIANG_3_autumn.png、sprites/world/JIANG_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YIMI_1 | world | 16x16 | 4 | sprites/world/YIMI_1_spring.png、sprites/world/YIMI_1_summer.png、sprites/world/YIMI_1_autumn.png、sprites/world/YIMI_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YIMI_2 | world | 16x16 | 4 | sprites/world/YIMI_2_spring.png、sprites/world/YIMI_2_summer.png、sprites/world/YIMI_2_autumn.png、sprites/world/YIMI_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YIMI_3 | world | 16x16 | 4 | sprites/world/YIMI_3_spring.png、sprites/world/YIMI_3_summer.png、sprites/world/YIMI_3_autumn.png、sprites/world/YIMI_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MIAN_1 | world | 16x16 | 4 | sprites/world/MIAN_1_spring.png、sprites/world/MIAN_1_summer.png、sprites/world/MIAN_1_autumn.png、sprites/world/MIAN_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MIAN_2 | world | 16x16 | 4 | sprites/world/MIAN_2_spring.png、sprites/world/MIAN_2_summer.png、sprites/world/MIAN_2_autumn.png、sprites/world/MIAN_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MIAN_3 | world | 16x16 | 4 | sprites/world/MIAN_3_spring.png、sprites/world/MIAN_3_summer.png、sprites/world/MIAN_3_autumn.png、sprites/world/MIAN_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SU_1 | world | 16x16 | 4 | sprites/world/SU_1_spring.png、sprites/world/SU_1_summer.png、sprites/world/SU_1_autumn.png、sprites/world/SU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SU_2 | world | 16x16 | 4 | sprites/world/SU_2_spring.png、sprites/world/SU_2_summer.png、sprites/world/SU_2_autumn.png、sprites/world/SU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SU_3 | world | 16x16 | 4 | sprites/world/SU_3_spring.png、sprites/world/SU_3_summer.png、sprites/world/SU_3_autumn.png、sprites/world/SU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIAO_1 | world | 16x16 | 4 | sprites/world/QIAO_1_spring.png、sprites/world/QIAO_1_summer.png、sprites/world/QIAO_1_autumn.png、sprites/world/QIAO_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIAO_2 | world | 16x16 | 4 | sprites/world/QIAO_2_spring.png、sprites/world/QIAO_2_summer.png、sprites/world/QIAO_2_autumn.png、sprites/world/QIAO_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| QIAO_3 | world | 16x16 | 4 | sprites/world/QIAO_3_spring.png、sprites/world/QIAO_3_summer.png、sprites/world/QIAO_3_autumn.png、sprites/world/QIAO_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDAO_1 | world | 16x16 | 4 | sprites/world/WANDAO_1_spring.png、sprites/world/WANDAO_1_summer.png、sprites/world/WANDAO_1_autumn.png、sprites/world/WANDAO_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDAO_2 | world | 16x16 | 4 | sprites/world/WANDAO_2_spring.png、sprites/world/WANDAO_2_summer.png、sprites/world/WANDAO_2_autumn.png、sprites/world/WANDAO_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDAO_3 | world | 16x16 | 4 | sprites/world/WANDAO_3_spring.png、sprites/world/WANDAO_3_summer.png、sprites/world/WANDAO_3_autumn.png、sprites/world/WANDAO_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| HUAJIAO_1 | world | 16x16 | 4 | sprites/world/HUAJIAO_1_spring.png、sprites/world/HUAJIAO_1_summer.png、sprites/world/HUAJIAO_1_autumn.png、sprites/world/HUAJIAO_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| HUAJIAO_2 | world | 16x16 | 4 | sprites/world/HUAJIAO_2_spring.png、sprites/world/HUAJIAO_2_summer.png、sprites/world/HUAJIAO_2_autumn.png、sprites/world/HUAJIAO_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| HUAJIAO_3 | world | 16x16 | 4 | sprites/world/HUAJIAO_3_spring.png、sprites/world/HUAJIAO_3_summer.png、sprites/world/HUAJIAO_3_autumn.png、sprites/world/HUAJIAO_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JU_1 | world | 16x16 | 4 | sprites/world/JU_1_spring.png、sprites/world/JU_1_summer.png、sprites/world/JU_1_autumn.png、sprites/world/JU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JU_2 | world | 16x16 | 4 | sprites/world/JU_2_spring.png、sprites/world/JU_2_summer.png、sprites/world/JU_2_autumn.png、sprites/world/JU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JU_3 | world | 16x16 | 4 | sprites/world/JU_3_spring.png、sprites/world/JU_3_summer.png、sprites/world/JU_3_autumn.png、sprites/world/JU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JU_TREE | world | 32x32 | 4 | sprites/world/JU_TREE_spring.png、sprites/world/JU_TREE_summer.png、sprites/world/JU_TREE_autumn.png、sprites/world/JU_TREE_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| JU_TREE_F | world | 32x32 | 4 | sprites/world/JU_TREE_F_spring.png、sprites/world/JU_TREE_F_summer.png、sprites/world/JU_TREE_F_autumn.png、sprites/world/JU_TREE_F_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LI_TREE | world | 32x32 | 4 | sprites/world/LI_TREE_spring.png、sprites/world/LI_TREE_summer.png、sprites/world/LI_TREE_autumn.png、sprites/world/LI_TREE_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LI_TREE_F | world | 32x32 | 4 | sprites/world/LI_TREE_F_spring.png、sprites/world/LI_TREE_F_summer.png、sprites/world/LI_TREE_F_autumn.png、sprites/world/LI_TREE_F_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| BANLI_TREE | world | 32x32 | 4 | sprites/world/BANLI_TREE_spring.png、sprites/world/BANLI_TREE_summer.png、sprites/world/BANLI_TREE_autumn.png、sprites/world/BANLI_TREE_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| BANLI_TREE_F | world | 32x32 | 4 | sprites/world/BANLI_TREE_F_spring.png、sprites/world/BANLI_TREE_F_summer.png、sprites/world/BANLI_TREE_F_autumn.png、sprites/world/BANLI_TREE_F_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| CHA_BUSH | world | 32x32 | 4 | sprites/world/CHA_BUSH_spring.png、sprites/world/CHA_BUSH_summer.png、sprites/world/CHA_BUSH_autumn.png、sprites/world/CHA_BUSH_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| CHA_BUSH_F | world | 32x32 | 4 | sprites/world/CHA_BUSH_F_spring.png、sprites/world/CHA_BUSH_F_summer.png、sprites/world/CHA_BUSH_F_autumn.png、sprites/world/CHA_BUSH_F_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ZHU_GROW | world | 32x32 | 4 | sprites/world/ZHU_GROW_spring.png、sprites/world/ZHU_GROW_summer.png、sprites/world/ZHU_GROW_autumn.png、sprites/world/ZHU_GROW_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ZHU_READY | world | 32x32 | 4 | sprites/world/ZHU_READY_spring.png、sprites/world/ZHU_READY_summer.png、sprites/world/ZHU_READY_autumn.png、sprites/world/ZHU_READY_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LAN_1 | world | 16x16 | 4 | sprites/world/LAN_1_spring.png、sprites/world/LAN_1_summer.png、sprites/world/LAN_1_autumn.png、sprites/world/LAN_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LAN_2 | world | 16x16 | 4 | sprites/world/LAN_2_spring.png、sprites/world/LAN_2_summer.png、sprites/world/LAN_2_autumn.png、sprites/world/LAN_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LAN_3 | world | 16x16 | 4 | sprites/world/LAN_3_spring.png、sprites/world/LAN_3_summer.png、sprites/world/LAN_3_autumn.png、sprites/world/LAN_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YU_1 | world | 16x16 | 4 | sprites/world/YU_1_spring.png、sprites/world/YU_1_summer.png、sprites/world/YU_1_autumn.png、sprites/world/YU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YU_2 | world | 16x16 | 4 | sprites/world/YU_2_spring.png、sprites/world/YU_2_summer.png、sprites/world/YU_2_autumn.png、sprites/world/YU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| YU_3 | world | 16x16 | 4 | sprites/world/YU_3_spring.png、sprites/world/YU_3_summer.png、sprites/world/YU_3_autumn.png、sprites/world/YU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDOU_1 | world | 16x16 | 4 | sprites/world/WANDOU_1_spring.png、sprites/world/WANDOU_1_summer.png、sprites/world/WANDOU_1_autumn.png、sprites/world/WANDOU_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDOU_2 | world | 16x16 | 4 | sprites/world/WANDOU_2_spring.png、sprites/world/WANDOU_2_summer.png、sprites/world/WANDOU_2_autumn.png、sprites/world/WANDOU_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| WANDOU_3 | world | 16x16 | 4 | sprites/world/WANDOU_3_spring.png、sprites/world/WANDOU_3_summer.png、sprites/world/WANDOU_3_autumn.png、sprites/world/WANDOU_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ZHUMA_1 | world | 16x16 | 4 | sprites/world/ZHUMA_1_spring.png、sprites/world/ZHUMA_1_summer.png、sprites/world/ZHUMA_1_autumn.png、sprites/world/ZHUMA_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ZHUMA_2 | world | 16x16 | 4 | sprites/world/ZHUMA_2_spring.png、sprites/world/ZHUMA_2_summer.png、sprites/world/ZHUMA_2_autumn.png、sprites/world/ZHUMA_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| ZHUMA_3 | world | 16x16 | 4 | sprites/world/ZHUMA_3_spring.png、sprites/world/ZHUMA_3_summer.png、sprites/world/ZHUMA_3_autumn.png、sprites/world/ZHUMA_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SUAN_1 | world | 16x16 | 4 | sprites/world/SUAN_1_spring.png、sprites/world/SUAN_1_summer.png、sprites/world/SUAN_1_autumn.png、sprites/world/SUAN_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SUAN_2 | world | 16x16 | 4 | sprites/world/SUAN_2_spring.png、sprites/world/SUAN_2_summer.png、sprites/world/SUAN_2_autumn.png、sprites/world/SUAN_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| SUAN_3 | world | 16x16 | 4 | sprites/world/SUAN_3_spring.png、sprites/world/SUAN_3_summer.png、sprites/world/SUAN_3_autumn.png、sprites/world/SUAN_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MAI_1 | world | 16x16 | 4 | sprites/world/MAI_1_spring.png、sprites/world/MAI_1_summer.png、sprites/world/MAI_1_autumn.png、sprites/world/MAI_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MAI_2 | world | 16x16 | 4 | sprites/world/MAI_2_spring.png、sprites/world/MAI_2_summer.png、sprites/world/MAI_2_autumn.png、sprites/world/MAI_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| MAI_3 | world | 16x16 | 4 | sprites/world/MAI_3_spring.png、sprites/world/MAI_3_summer.png、sprites/world/MAI_3_autumn.png、sprites/world/MAI_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LVFEI_1 | world | 16x16 | 4 | sprites/world/LVFEI_1_spring.png、sprites/world/LVFEI_1_summer.png、sprites/world/LVFEI_1_autumn.png、sprites/world/LVFEI_1_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LVFEI_2 | world | 16x16 | 4 | sprites/world/LVFEI_2_spring.png、sprites/world/LVFEI_2_summer.png、sprites/world/LVFEI_2_autumn.png、sprites/world/LVFEI_2_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| LVFEI_3 | world | 16x16 | 4 | sprites/world/LVFEI_3_spring.png、sprites/world/LVFEI_3_summer.png、sprites/world/LVFEI_3_autumn.png、sprites/world/LVFEI_3_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| W_RAIN_A | world | 32x32 | 4 | sprites/world/W_RAIN_A_spring.png、sprites/world/W_RAIN_A_summer.png、sprites/world/W_RAIN_A_autumn.png、sprites/world/W_RAIN_A_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| W_RAIN_B | world | 32x32 | 4 | sprites/world/W_RAIN_B_spring.png、sprites/world/W_RAIN_B_summer.png、sprites/world/W_RAIN_B_autumn.png、sprites/world/W_RAIN_B_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| W_SNOW_A | world | 32x32 | 4 | sprites/world/W_SNOW_A_spring.png、sprites/world/W_SNOW_A_summer.png、sprites/world/W_SNOW_A_autumn.png、sprites/world/W_SNOW_A_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| W_SNOW_B | world | 32x32 | 4 | sprites/world/W_SNOW_B_spring.png、sprites/world/W_SNOW_B_summer.png、sprites/world/W_SNOW_B_autumn.png、sprites/world/W_SNOW_B_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |
| W_FOG | world | 96x48 | 4 | sprites/world/W_FOG_spring.png、sprites/world/W_FOG_summer.png、sprites/world/W_FOG_autumn.png、sprites/world/W_FOG_winter.png | SEASON_PALS·四季 | docs/pixel-world.html |

## phenology（docs/pixel-phenology.html，24 个数组）

| 数组 | 稿板 | 尺寸 | 帧数 | 文件 | 色板 | 来源稿板 |
|---|---|---|---|---|---|---|
| I_LICHUN | phenology | 16x16 | 1 | sprites/phenology/I_LICHUN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_YUSHUI | phenology | 16x16 | 1 | sprites/phenology/I_YUSHUI.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_JINGZHE | phenology | 16x16 | 1 | sprites/phenology/I_JINGZHE.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_CHUNFEN | phenology | 16x16 | 1 | sprites/phenology/I_CHUNFEN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_QINGMING | phenology | 16x16 | 1 | sprites/phenology/I_QINGMING.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_GUYU | phenology | 16x16 | 1 | sprites/phenology/I_GUYU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_LIXIA | phenology | 16x16 | 1 | sprites/phenology/I_LIXIA.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_XIAOMAN | phenology | 16x16 | 1 | sprites/phenology/I_XIAOMAN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_MANGZHONG | phenology | 16x16 | 1 | sprites/phenology/I_MANGZHONG.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_XIAZHI | phenology | 16x16 | 1 | sprites/phenology/I_XIAZHI.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_XIAOSHU | phenology | 16x16 | 1 | sprites/phenology/I_XIAOSHU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_DASHU | phenology | 16x16 | 1 | sprites/phenology/I_DASHU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_LIQIU | phenology | 16x16 | 1 | sprites/phenology/I_LIQIU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_CHUSHU | phenology | 16x16 | 1 | sprites/phenology/I_CHUSHU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_BAILU | phenology | 16x16 | 1 | sprites/phenology/I_BAILU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_QIUFEN | phenology | 16x16 | 1 | sprites/phenology/I_QIUFEN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_HANLU | phenology | 16x16 | 1 | sprites/phenology/I_HANLU.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_SHUANGJIANG | phenology | 16x16 | 1 | sprites/phenology/I_SHUANGJIANG.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_LIDONG | phenology | 16x16 | 1 | sprites/phenology/I_LIDONG.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_XIAOXUE | phenology | 16x16 | 1 | sprites/phenology/I_XIAOXUE.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_DAXUE | phenology | 16x16 | 1 | sprites/phenology/I_DAXUE.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_DONGZHI | phenology | 16x16 | 1 | sprites/phenology/I_DONGZHI.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_XIAOHAN | phenology | 16x16 | 1 | sprites/phenology/I_XIAOHAN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |
| I_DAHAN | phenology | 16x16 | 1 | sprites/phenology/I_DAHAN.png | SEASON_PALS·本季 | docs/pixel-phenology.html |

## 派生资源（非像素数组，随导出生成）

| 文件 | 说明 |
|---|---|
| sprites/world/atlas_world_spring.png | world 16×16 地块四季 atlas |
| sprites/world/tileset_spring.tres | Godot 4 TileSet（TileSetAtlasSource，16×16 格） |
| sprites/world/atlas_world_summer.png | world 16×16 地块四季 atlas |
| sprites/world/tileset_summer.tres | Godot 4 TileSet（TileSetAtlasSource，16×16 格） |
| sprites/world/atlas_world_autumn.png | world 16×16 地块四季 atlas |
| sprites/world/tileset_autumn.tres | Godot 4 TileSet（TileSetAtlasSource，16×16 格） |
| sprites/world/atlas_world_winter.png | world 16×16 地块四季 atlas |
| sprites/world/tileset_winter.tres | Godot 4 TileSet（TileSetAtlasSource，16×16 格） |
| sprites/characters/characters_spriteframes.tres | Godot 4 SpriteFrames（家族 `_数字` 生长态与 `_A/B/C` 工具三帧分组为多帧动画，余单帧） |
| sprites/world/world_spriteframes.tres | Godot 4 SpriteFrames（家族 `_数字` 生长态与 `_A/B/C` 工具三帧分组为多帧动画，余单帧） |
| sprites/phenology/phenology_spriteframes.tres | Godot 4 SpriteFrames（家族 `_数字` 生长态与 `_A/B/C` 工具三帧分组为多帧动画，余单帧） |
