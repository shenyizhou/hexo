# React 长列表性能优化

## 遇到的问题

-   1000 个列表 tab 切换场景

react 正常渲染流程 fiber 树的构建流程

## Sync 同步调度模式

目前 React 只有一种调度模式：同步模式。

- React Diff 原理

## Concurrent 同时调度模式

-   是什么
    -   基于 fiber 的
-   从浏览器原理入手
    -   requestIdleCallback
-  如何实现
    - isShouldYield 来控制中断
    - lane 实现优先级， 以及 16.8 的 expiration time
-  suspense
-  风险？

<!-- ## fiber 与 hook -->

<!-- ## React 渲染原理

-   Fiber 是什么，解决什么问题
    -   stack reconciler 作对比
    -   17 lane 相对于
-   render 过程
    -   diff
-   commit 过程
    -   WIP 树显示 -->

## 如何优化

-   concurrent mode
    -   为什么不开启，class 的兼容问题？只用 hooks


useTransition？？