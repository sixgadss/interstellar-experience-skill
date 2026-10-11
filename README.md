# 星际体验设计 · Interstellar Experience

一个可复用的 Agent Skill，用于设计和改进立体星系、个人星空空间与星际导航界面。适用于支持 SKILL.md 的编程助手；附带 Codex 显示元数据。

关注三件事：真实的空间深度、可随时接管的航行、到达后的安静阅读。把内容放在星空中，同时让记录、阅读和返回保持顺手。

## 安装

Codex（macOS / Linux）：

```sh
git clone https://github.com/sixgadss/interstellar-experience-skill.git ~/.codex/skills/interstellar-experience
```

如果目标目录已经存在，先查看内容并更新现有副本；不要直接覆盖。其他支持 Agent Skills 的工具可将整个目录复制到各自的技能目录。

## 使用

```text
使用 $interstellar-experience，把现有星系网站改成可以连续航行、
抵达后安静阅读、返回出发视角的体验。先检查现有镜头和导航逻辑。
```

也可以用于星点布局、星系巡游、单手/双手接管、相似兴趣连接，以及网页版和离线 HTML 的一致性检查。

## 包含内容

- SKILL.md：触发范围、设计原则和实施路径。
- references/：空间渲染、航行生命周期、内容与验收方法。
- assets/flight.js：无依赖的可取消镜头插值示例。
- assets/flight.test.cjs：示例代码的行为测试。
- agents/openai.yaml：Codex 技能列表元数据。

测试示例：

```sh
node --test assets/flight.test.cjs
```

示例需要调用方接入自己的渲染循环和事件处理。它不是完整网站，不附带相机识别模型、天文图片、用户记录或云端认证服务。支持减少动态效果、键盘/触屏替代操作；手势体验需要真实设备验收。

## 来源与许可

整理自 pablito-astra 个人星系项目的设计与调试实践。发布包只包含原创指导和镜头示例，不包含第三方视觉素材或用户数据。

MIT License。
