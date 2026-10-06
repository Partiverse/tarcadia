extends Node
## Headless 冒烟场景：断言引擎骨架的像素完美配置与导入管线。
## 运行：godot --headless --path . res://scenes/smoke.tscn
## 全绿打印 SMOKE_OK 并 exit 0；任何失败打印 SMOKE_FAIL 并 exit 1。
## 本脚本只验工程配置与资源加载，不含任何游戏逻辑（实现期纪律）。

var _failures: Array[String] = []
var _checks := 0


func _ready() -> void:
	print("SMOKE godot=", Engine.get_version_info()["string"])
	print("SMOKE headless=", DisplayServer.get_name())

	# —— 视口与整数缩放 ——
	_expect("display/window/size/viewport_width", 640)
	_expect("display/window/size/viewport_height", 360)
	_expect("display/window/stretch/mode", "viewport")
	_expect("display/window/stretch/aspect", "keep")
	_expect("display/window/stretch/scale_mode", "integer")

	# —— 纹理默认 nearest（0 = NEAREST）与像素吸附 ——
	_expect("rendering/textures/canvas_textures/default_texture_filter", 0)
	_expect("rendering/2d/snap/snap_2d_transforms_to_pixel", true)
	_expect("rendering/2d/snap/snap_2d_vertices_to_pixel", true)

	# —— 导入管线：16×16 冒烟夹具须能经 --import 后加载 ——
	_expect_fixture()

	_report()


func _expect(setting: String, expected: Variant) -> void:
	_checks += 1
	if not ProjectSettings.has_setting(setting):
		_failures.append("%s 缺失" % setting)
		return
	var got: Variant = ProjectSettings.get_setting(setting)
	if got != expected:
		_failures.append("%s = %s（期望 %s）" % [setting, got, expected])


func _expect_fixture() -> void:
	_checks += 1
	var tex: Texture2D = load("res://assets/tiles/smoke_tile.png")
	if tex == null:
		_failures.append("assets/tiles/smoke_tile.png 加载失败（导入管线断）")
		return
	if tex.get_width() != 16 or tex.get_height() != 16:
		_failures.append("冒烟夹具尺寸 %dx%d ≠ 16×16" % [tex.get_width(), tex.get_height()])
		return
	# headless 渲染服务为 dummy，像素回读不可用——尺寸与可加载性即导入管线证据。
	print("SMOKE fixture=16x16 loaded")


func _report() -> void:
	if _failures.is_empty():
		print("SMOKE_OK %d/%d 断言全过" % [_checks, _checks])
		get_tree().quit(0)
	else:
		for f in _failures:
			printerr("SMOKE_FAIL " + f)
		printerr("SMOKE_FAIL %d/%d 过" % [_checks - _failures.size(), _checks])
		get_tree().quit(1)
