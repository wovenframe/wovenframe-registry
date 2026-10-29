# WovenFrame · 织帧 模板目录（Registry）

这里是 [WovenFrame（织帧）](../../../../) 的**模板目录仓库**：一份 `templates.json`，是模板商店的「卡片目录」。

- **不存模板文件、不存视频**——每个模板的代码与素材都在作者自己的 GitHub 仓库里。
- 本仓库只记录：模板 id / 名称 / 一句话介绍 / 作者 / 仓库地址 / 许可证 / 标签 / 预览图与演示视频地址 / GitHub star / 下载量 / 浏览量。
- `stars`、`downloads`、`lastPush` 由 [`.github/workflows/sync.yml`](.github/workflows/sync.yml) **每小时**从 GitHub API 自动同步；`views` 由客户端侧的匿名计数器上报。
- 本仓库只接受 **JSON 数据**，不接受脚本或可执行文件。

## 客户端怎么读

编辑器/商店客户端直接拉取：

```
https://raw.githubusercontent.com/LeeRolling/wovenframe-registry/main/templates.json
```

并使用 ETag / `If-None-Match` 缓存（默认 1 小时），失败时回退本地缓存。字段定义见 [`schema/templates.schema.json`](schema/templates.schema.json)。

## 收录规则（作者提交）

一个模板 = 一个 GitHub 仓库。作者在自己的仓库里放好模板，然后向本仓库提 PR，在 `templates.json` 的 `templates` 数组里**追加一条**条目。完整流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

硬性要求：

1. 模板仓库**公开**，根目录有可用的 `template.json`（WovenFrame 模板格式）。
2. 仓库里有 `preview.png`（或 `preview.jpg`，16:9，≥1280×720）。
3. 仓库里有演示视频：**≥480p，25/30fps，H.264**，`≤100MB`（建议 ≥10MB），链接使用 GitHub Release 资产地址。
4. 许可证作者自定（MIT / CC-BY / 自定义均可），在 `license` 字段写明。
5. 内容合法合规：不含法律明确禁止的内容（色情、政治敏感、暴力/反人类、隐私泄露等）。

审核：**AI 代码审查 + 人工视频审核**，目标 **72 小时内**给出结论（周末与法定节假日不计）。通过后合并 PR，目录自动生效。

## 字段速查

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | 小写唯一 id，如 `leerolling.origami-sunrise` |
| `name` | ✓ | 显示名 |
| `description` | ✓ | 一句话介绍（≤280 字） |
| `author.name` / `author.url` | ✓ / — | 作者名与主页 |
| `repo` | ✓ | 模板仓库 `owner/repo` |
| `license` | ✓ | 许可证标识 |
| `submittedAt` | ✓ | 提交日期 `YYYY-MM-DD` |
| `tags` / `locale` | — | 分类标签 / 语言 |
| `preview` / `demoVideo` | — | 预览图 / 演示视频直链 |
| `stars` / `downloads` / `views` | 自动 | 由同步任务与客户端计数器维护 |
| `status` | — | `active` / `deprecated` / `blocked` |
| `minAppVersion` | — | 最低编辑器版本 |

## 免责声明

模板由作者独立提供，版权与许可证由作者负责；WovenFrame 只做目录索引与展示。如发现侵权或违规内容，请提 Issue，我们会在核实后下架（`status: blocked`）。

## 许可证

本目录仓库（仅目录与同步脚本）使用 MIT，见 [LICENSE](LICENSE)。各模板的许可证以各自仓库为准。
