# 向 WovenFrame 模板目录提交模板

一个模板 = 一个 GitHub 仓库。目录仓库只收一条「卡片」，不接收模板文件。

## 步骤

1. **准备模板仓库**（你自己的账号下，公开）
   - 根目录 `template.json`（WovenFrame 模板格式）
   - `preview.png`（或 `.jpg`，16:9，≥1280×720）
   - 演示视频：≥480p、25/30fps、H.264、≤100MB（建议 ≥10MB），上传到本仓库 Release，拿到直链
   - `license`：在仓库 README 与 `template.json` 里写明（MIT / CC-BY / 自定义均可）
2. **Fork 本目录仓库**
3. 在 `templates.json` 的 `templates` 数组里追加一条（见下方模板），`submittedAt` 填当天日期
4. 本地自检：`node scripts/validate.mjs`
5. 提交 PR，标题格式：`add: <作者>/<模板名>`

## 条目模板

```json
{
  "id": "yourname.my-template",
  "name": "我的模板",
  "description": "一句话说明这个模板做什么。",
  "author": { "name": "你的 GitHub 用户名", "url": "https://github.com/you" },
  "repo": "you/my-template",
  "license": "MIT",
  "tags": ["启动动画"],
  "locale": ["zh-CN"],
  "preview": "https://raw.githubusercontent.com/you/my-template/main/preview.png",
  "demoVideo": "https://github.com/you/my-template/releases/download/v1.0.0/demo.mp4",
  "submittedAt": "2026-10-30"
}
```

`stars` / `downloads` / `lastPush` / `syncedAt` 会被每小时同步任务自动维护，**不要手填**；`views` 由客户端计数器写入，也不用填。

## 审核标准

| 项 | 要求 |
|---|---|
| 仓库可访问 | 公开、非空、根目录有 `template.json` |
| 预览图 | 16:9，清晰可辨，不糊 |
| 演示视频 | 符合上方的分辨率/帧率/格式/体积要求，内容与模板一致 |
| 许可证 | 非空的 `license` 字段；第三方素材需有署名与许可 |
| 内容合规 | 不含色情、政治敏感、暴力/反人类、隐私泄露等法律禁止内容 |
| 代码审查 | AI 通读模板代码/JSON，确认无恶意逻辑（目录只收 JSON，不收可执行文件） |

审核目标 **72 小时**内给出结论（周末与法定节假日不计）。不通过会说明原因，修正后可再次提交。

## 下架

作者可自行提交 PR 把 `status` 改为 `deprecated`；侵权/违规经核实改为 `blocked` 并由维护者移除预览/视频链接。
