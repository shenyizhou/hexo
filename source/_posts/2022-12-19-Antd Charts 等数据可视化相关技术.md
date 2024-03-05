---
title: Antd Charts 等数据可视化相关技术
date: 2022-12-19 18:43:16
categories:
    - 前端综合
tags:
    - 图表
---

大概涉及到的几个技术栈中，`Ant Design Charts` 是对 `G2Plot` 做了 React 化，`G2Plot` 是对 `G2` 做了API上的优化，`G2` 是对 `G` 做了图表的封装，而最底层的 `G` 是一套同时支持 Canvas 和 SVG 的 2D 渲染引擎。后三者都是 `AntV` 团队的作品，已开源，文档地址统一贴在文末。

### G

`G` 的实现原理就是在画布 `Canvas` 上增加图形 `Shape`，仿佛作画一般。

如下的代码画一块 600 \* 500 的画布：

```javascript
// 这里的 Canvas 只是画布的意思，如果是 svg，则是 import { Canvas } from '@antv/g-svg';
import { Canvas } from '@antv/g-canvas';

// 会有个只读属性 renderer = 'canvas' | 'svg'
const canvas = new Canvas({
    container: 'container', // 容器 id，也可以直接传入 DOM 元素
    width: 600,
    height: 500
});
```

如下的代码在这块画布上画一个圆：

```javascript
canvas.addShape('circle', {
    attrs: {
        x: 300, // x 坐标(圆形是相对于圆心，矩形是相对于左上角)
        y: 200, // y 坐标(同上)
        r: 100, // 半径
        fill: '#1890FF', // 填充色
        stroke: '#F04864', // 边框色
        lineWidth: 4, // 边框宽度
        radius: 8 // 圆角半径，主要对矩形配置使用，这里其实没用上
    }
});
```

结果如图所示：

![结果图](https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*Hz29QLOXPRYAAAAAAAAAAABkARQnAQ)

类型除了圆形`circle`，还支持椭圆`ellipse`、矩形`rect`(包括圆角)、直线`line`、折线`polyline`、多边形`polygon`、路径`path`，以及几何图形、图片、文本、DOM 节点等。

除了单独画图形 `Shape`，还支持增加分组 `Group`，如下：

```javascript
const group = canvas.addGroup();
const circle = group.addShape('circle' /* 同上省略参数 */);
```

这样的好处是可以实现事件冒泡和委托，如下：

```javascript
// 事件冒泡
group.on('mouseenter', () => {
    circle.attr('fill', '#2FC25B');
});
// 事件委托
group.on('circle:mouseenter', () => {
    circle.attr('fill', '#2FC25B');
});
```

#### [源码](https://github.com/antvis/g)

`G` 是一个用 `lerna` 搭建的仓库，底下包括 `g-base`、`g-canva`、`g-svg`、`g-math`、`g-mobile`、`g-webgl` 几个仓库。

`g-base` 包含了抽象画布 `AbstractCanvas` 之类的基类定义，以及在 `g-base/lib/types` 保存了相关 ts 定义。

`g-canva`、`g-svg` 则是两套分别基于 canvas 和 svg 的具体实现，两者在 `draw` 方法的实现上有差异。

`g-math` 提供几何图形的运算。

`g-mobile`、`g-webgl` 暂时还无内容。

### G2

`G2` 是相对比较完善的图表库了，也是 AntV 团队 Star 数最高(10.3k)的作品了。

他是通过容器和数据源，配合图形语法，绘制出图表的。如下是创建 `Chart` 对象：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
    container: 'c1', // 指定图表容器 ID
    width: 600, // 指定图表宽度
    height: 300 // 指定图表高度
});
```

可以见到和 `G` 创建画布如出一辙。如下是载入数据源：

```javascript
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

chart.data(data);
```

接下来便是用 `G2` 的图形语法绘制图表。如下是绘制柱状图的一个例子：

```javascript
chart.interval().position('genre*sold');
chart.render(); // 渲染
```

结果如图所示：

![结果图](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*8qbLQb7A0loAAAAAAAAAAABkARQnAQ)

#### 源码

`G2` 的容器就是 `G` 的画布，会根据 `renderer` 调用 `getEngine` 获取不同的引擎（canvas/svg）。

### G2Plot

`G2Plot` 就是在 `G2` 封装的基础上做了写法的优化。

### Ant Design Charts

`Ant Design Charts` 对我而言就是就是封装了一层自定义组件，让我可以不必再手动写 `useEffect` 等逻辑去手动更新 `G2Plot` 的 `config` 或 `data`。额外地，他还支持以下几个新功能：

-   Tooltip 支持 ReactNode
-   额外的 `downloadImage()`、`toDataURL()` 等 API
-   自定义 memoData 功能，按需控制图表 rerender

### 参考资料

-   [Ant Design Charts 文档](https://charts.ant.design/guide)
-   [G2Plot 文档](https://g2plot.antv.vision/zh/docs/manual/introduction)
-   [G2 文档](https://antv-g2.gitee.io/zh/docs/manual/about-g2)
-   [G 文档](https://g.antv.vision/zh/docs/guide/introduce)

> 未完待续