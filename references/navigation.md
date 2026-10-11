# 镜头与航行生命周期

## 状态和所有权

最小镜头快照是 `{orientation:{x,y,z,w}, focus:{x,y,z}, zoom}`。跨星系返航还保存 scene/galaxy ID；读取浮层和导航历史不要各自覆盖同一份快照。进入前深拷贝出发状态，抵达后停稳阅读，退出后恢复原场景及完整姿态。

把有限航行和后台动态拆开。调度条件可为 `backgroundActive || flight.active || explicitRedraw`。进入阅读后暂停场景；用成对的 lease/release 恢复此前用户的动态偏好。不要为驱动航行临时打开整片星空的自动漂移。

所有输入都交给同一相机控制器。拖动、缩放、键盘移动、手势变换、新目标、设置或分享浮层打开时，先取消旧航程，再接管当前姿态。取消要让旧 Promise 返回 false；异步附件/导航用会话代号防止迟到结果更新新页面。若一个按钮因旅行变成异步，调用者也要等待：查找结果到达后才把焦点放到可见的进入按钮。

缩放通常在对数域插值；朝向做最短弧 slerp；焦点连续移动。保持单位、符号和镜头约定与原项目一致。结束时应用精确目标，避免永远渐近。时长从项目 token 读取，不把固定秒数推广为所有项目的要求。减少动态效果时直接应用目的地，不创建飞行 RAF。

文档隐藏时停止绘制，保留航程进度；恢复时重置帧时钟，避免一次补进隐藏期间的全部时间。低帧率采用受限 dt，确认结束后真的停止调度。

## 可运行的示例

`assets/flight.js` 暴露 `Flight`（浏览器为 `InterstellarFlight.Flight`，CommonJS 为 `require(...).Flight`）。输入契约：有限的 focus，归一化 quaternion，有限且大于 0 的 zoom，有限非负 duration/dt。调用方验证输入。

```js
const flight = new InterstellarFlight.Flight();
const departure = structuredClone(camera.getView());
const arrival = flight.start(departure, destination, reducedMotion ? 0 : duration);
applyFrame(flight.advance(0));
requestRender();
if (await arrival) openReader();
```

`start()` 自动取消前一航程；`advance(dt)` 返回当前姿态，完成时 resolve(true)；`cancel()` resolve(false)，保留当前位置。每帧将返回姿态写入镜头和 controls target，绘制后仅在需要时排下一个 RAF。它不管理 DOM、场景切换、识别器或阅读器。

**接口适配要点**：per-frame `applyFrame` 只写镜头。已有 `restoreView` 如果会取消航行、清理阅读会话或重启动态，不能直接拿来每帧调用；为它拆出无副作用的写入路径。把内容会话代号与关闭按钮身份分开，避免取消加载之后关闭失效。外部加载器返回数据，经过代号检查后才提交到 UI。

## 手势与场景切换

单手旋转/指向，捏合确认，双手缩放/转轴等映射按现有产品选择；不要强行增加复杂手势。识别器输出与鼠标共享的 rotate/zoom/select/return 命令。使用一致的镜像坐标、时间归一化滤波、置信度门限与迟滞，短暂丢手保持或重新基准，避免跳变。拖拽捏合不能误触点击。

切换星系：保存 route 后，先接近锚点，再切换场景并进入目标视角。复用已经保存的视角；取消发生在接近阶段时不应丢失 route。用户返回时恢复场景 ID 和姿态。同步 API 的调用者若依赖立即切换（如生成分享列表），保持这个 API，另加异步 visit；不要悄悄改变合同。

## 交互层级

环境场景是 base；前景操作栏是 raised；浮层按项目自己的 dropdown/modal 层级。星点按深度排序只能发生在隔离的场景 stacking context 内。筛选条位于场景标记之上，不能被透明的大点击区域盖住。

验收时对返回、设置、缩放控件中心运行 `document.elementFromPoint(...)` 的只读观察，确认落到目标或其后代。再真实点击一次。仅看到按钮或看到正确 z-index 不足以证明可点。
