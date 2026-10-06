# game/ — tarcadia 引擎骨架（Godot 4.x 单工程）

设计正典在 `docs/`（vertical-slice-design、production-scope 等），本目录只承接引擎现实，两线并行互不改写。
来源：docs/vertical-slice-design.md:133「Godot 4.x 单工程」；docs/unfreeze-assessment.md:205–208 T1–T4 全绿解除实现冻结。

## 渲染管线（16px 像素完美，已入 project.godot）

| 项 | 值 | 理由 |
|---|---|---|
| 基座视口 | 640×360 | 16px 地块 40×22.5 格；×2/×3/×4 整数倍对齐 720p/1080p/4K |
| stretch | mode=viewport, aspect=keep, scale_mode=integer | 先低清整幅渲染再整数倍放大，禁非整数拉伸 |
| 纹理过滤 | rendering/textures/canvas_textures/default_texture_filter=0 (Nearest) | 全局最近邻，CanvasItem 默认无插值 |
| 导入默认 | 无损压缩 + 关 mipmap + 禁 3D 检测重压（importer_defaults.texture） | 像素画导入三件套 |
| 像素吸附 | snap_2d_transforms_to_pixel / snap_2d_vertices_to_pixel = true | 亚像素抖动双保险 |
| 渲染后端 | GL Compatibility（含 mobile 回退） | 2D 像素游戏标准配置 |

## 目录规范

```
game/
├── project.godot        # 工程配置（渲染管线见上表）
├── assets/
│   ├── sprites/         # 16/32/48 宽精灵帧（人物/作物/物件；稿板导出后入此）
│   └── tiles/           # 16×16 地块与 autotile 集（smoke_tile.png 仅为导入管线冒烟夹具，非正典美术）
├── scenes/              # 场景文件（smoke.tscn = headless 冒烟场景）
├── scripts/             # GDScript（smoke.gd = 冒烟断言，不含游戏逻辑）
└── tools/               # 工具链（smoke.mjs = 仓库级闸门；godot.path = 探测结果，不入库）
```

## 闸门（任何失败 exit 非 0）

```bash
node game/tools/smoke.mjs
```

流程：探测 Godot 4.x（`GODOT_BIN` 环境变量 > PATH > 常见安装位）→ 路径写 `tools/godot.path` →
缺失时生成 16×16 冒烟夹具 PNG → `godot --headless --import` → `godot --headless res://scenes/smoke.tscn`
（断言 9 项：视口/整数缩放/nearest/像素吸附/夹具加载，见 scripts/smoke.gd）。
headless 渲染服务为 dummy，像素回读不可用，故 nearest 以配置断言 + 导入可加载性作证据，视觉终审仍归 pixel-audit 四步链。

## 已知边界

- `game/tools/godot.path` 与 `.godot/`（导入缓存）不入库，见 `.gitignore`。
- 主场景暂指 smoke.tscn；首个游戏场景落地时由实现线改写。
