---
title: React相关知识点
date: 2024-05-03 10:17:51
categories:
  - React
tags:
  - React
---

<!-- more -->

[TOC]

## React 18 新特性

### 新的 ReactHooks

#### useTransition 和 startTransition，即过渡更新模式(Transition Mode)

可以将某些状态更新标记为不紧急的。

相比于 `setTimeout`

- `startTransition` 是立刻执行的，`setTimeout` 是延迟执行的。
- `startTransition` 可被中断的，`setTimeout` 是阻塞的。

```javascript
const [isPending, startTransition] = useTransition();
const [count, setCount] = useState(0);

function handleClick() {
  startTransition(() => {
    setCount((c) => c + 1);
  });
}
```

#### useDeferredValue，即延迟渲染(Deferred Rendering)

实现类似于防抖节流的延迟渲染，是可被中断的，没有固定的时间延迟。

```javascript
function Father() {
  const [value, setValue] = useState(0);
  const deferredValue = useDeferredValue(value);

  return (
    <div>
      <button onClick={() => setValue((v) => v + 1)}>Father: {value}</button>
      <Child value={deferredValue} />
    </div>
  );
}

function Child({ value }) {
  let temp = 0;
  for (let i = 0; i < 1000000000; i++) {
    temp++;
  }
  return <div>Child: {value}</div>;
}
```

#### useId

`useId` 用于生成唯一的 id。

```javascript
const id = useId();
```

#### useSyncExternalStore

用于同步外部状态，常用于集成外部 React 库。

```javascript
const value = useSyncExternalStore(externalStore.subscribe, externalStore.read);
return <div>{value}</div>;
```

#### useInsertionEffect

类似于 useEffect，在 useLayoutEffect 获取布局前执行。一般用于动态插入 style 标签或 SVG 的 defs。

缺点是不能获取到 refs，也不能触发 React 更新。

```javascript
// 在你的 CSS-in-JS 库中
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // 同前所述，我们不建议在运行时注入 <style> 标签。
    // 如果你必须这样做，那么应当在 useInsertionEffect 中进行。
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS("...");
  return <div className={className} />;
}
```

注意：useInsertionEffect 在 SSR 阶段是不会执行的。

### 并发模式(Concurrent Mode)

有两个重要特性：

- 渲染可中断。让用户输入立即被响应。
- 可重用状态。如切换标签页时，能立即恢复到之前的状态。后期考虑增加<Offscreen>标签。

适用场景：计算量大的游戏应用、地图应用和机器学习应用。

#### 和 Fiber 的关系

Fiber 简介：

- React 16 之前用的是 Stack Reconciler，任务无法中断或拆分，递归方式更新。
- React 16 引入 Fiber 架构，任务可中断和恢复，遍历更新。将更新任务拆分成小任务(即 Fibers)，引入了调度器(Sehedule)，从而将渲染任务拆分至主线程空闲时完成。

关系：

- Fiber 架构的细粒度任务调度模式，为并发模式提供了基础。
- 在 React 18 之前，Fiber 可以让任务暂停并根据优先级执行，并支持异步渲染，但属于同步不可中断更新。在 React 之后，可以交替执行不同任务，变为异步可中断更新。
- 并发模式是实现并发更新的基本前提，时间切片是实现并发更新的具体手段。

#### 应用

- 通过 `startTransition` 和 `useTransition` 实现过渡更新模式。
- 通过 `useDeferredValue` 实现延迟渲染。
- `Suspense`。
- `RSC(React Server Components)`。

### Suspense

依赖于错误边界(ErrorBoundary)组件，可以捕获子组件抛出的任何错误。

此前 Suspense 主要用来配合 React.lazy 实现代码拆分和懒加载。

React 18 中的 Suspense 新增了对 SSR 的支持。属于特殊的错误边界组件。在子组件抛出 Promise 时会渲染 fallback UI，直到 Promise resolved 之后重新渲染。

现在，即时 Suspense 的值为 null 或 undefined，也不会跳过。

### RSC(React Server Components)

对比 SSR 和 SSG：
- 不会在服务器上注水，不会向客服端发送任何 JS。
- 减少了 JS 捆绑包的体积

RSC 的优点：
- 减轻客户端工作负载，改善 LCP 和 FID。
- 高效的 SEO。
- 增强的安全性。
- 有权限直接访问服务端程序和 API，数据获取更快，客户端只能通过请求访问部分程序。

缺点：
- 不能用 React Hooks。
- 不能访问浏览器 API。

#### CSR -> SSR

- 

#### React Suspense and Streaming

可以暂停 React 数中的呈现，在后台获取内容并将其分块流式传输到客户端时显示一个正在加载的组件作为占位符，一旦准备就绪就会无缝切换。

### React DOM Server

都支持流式 Suspense。

#### renderToPipeableStream

用于 Node 的流式传输。

#### renderToReadableStream

用于 Deno 或 Cloudflare Workers。

### React DOM Client

两者都接收一个新选项：`onRecoverableError`。

#### createRoot

`createRoot` 用于创建根节点。替代 `reactDOM.render`。

```javascript
const root = createRoot(document.getElementById("root"));
```

#### hydrateRoot

`hydrateRoot` 用于服务器渲染。替代 `reactDOM.hydrate`。

### 自动批处理(Automatic Batching)

在 React 18 之前，异步更新比如同一个 Pormise 里的多个 setState 不会自动合并，需要手动调用 unstable_batchedUpdates 合并更新。

从 React 18 开始 createRoot，React 会自动合并异步更新。

可以用 React.flushSync() 退出批处理。

### 新的严格模式行为

### 其他

- React 组件可以返回 undefined。

## React Hooks

### React Hooks 列表

#### useState

`useState` 返回一个数组，第一个元素是状态值，第二个元素是更新状态的函数，在这个回调函数里可以获取到更新后的 state。

在 React 18 开始，`setState` 在异步函数里不会立刻更新状态，React 会将多个 `setState` 合并成一个更新。

```javascript
const [count, setCount] = useState(0);
```

#### useEffect

`useEffect` 用于执行副作用操作，比如数据请求、DOM 操作等。

第二个参数是依赖数组，只有依赖数组中的值发生变化时，才会执行副作用操作。

```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
```

#### useContext

`useContext` 用于在函数组件中获取上下文。

```javascript
const value = useContext(MyContext);
```

#### useReducer

`useReducer` 用于复杂的状态逻辑。

第一个参数是 reducer 函数，第二个参数是初始状态，第三个参数是初始化函数。

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });

dispatch({ type: "increment" });
```

#### useCallback

`useCallback` 用于缓存函数。

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### useMemo

`useMemo` 用于缓存计算结果。

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### useRef

`useRef` 用于获取 DOM 元素或缓存变量。

```javascript
const inputEl = useRef(null);
```

#### useImperativeHandle

`useImperativeHandle` 用于自定义暴露给父组件的实例值。

```javascript
forwardRef((props, ref) => {
  const inputEl = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputEl.current.focus();
    },
  }));
});
```

可以将子组件暴露给父组件，让父组件可以直接调用子组件的方法。

#### useLayoutEffect

`useLayoutEffect` 与 `useEffect` 类似，但是会在浏览器 layout 之后执行。

```javascript
useLayoutEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
```

适用于要测量计算 DOM 尺寸或者位置的情况，避免出现闪烁或布局抖动。

#### useDebugValue

`useDebugValue` 用于在 React 开发者工具中显示自定义 hook 的标签。

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}
```

### 常见的问题

#### 闭包陷阱

在如 `useEffect`、`useCallback`、`useMemo` 等 hooks 中，如果使用外部变量，React 只会记住该变量的初始值，除非依赖项更新否则而不会更新。

#### 引用类型的依赖项

在如 `useEffect`、`useCallback`、`useMemo` 等 hooks 中，如果依赖项是一个对象，那么每次更新时都会生成一个新的对象，导致依赖项发生变化，从而导致副作用操作执行多次。

```javascript
const [state, setState] = useState({ count: 0 });

useEffect(() => {
  console.log("effect");
}, [state]);
```

## 父子组件之间交互的方式

建议的方式：

- 父组件通过 props 传递数据给子组件，通过 useCallback 传递函数给子组件。
- 通过 useContext 在父子组件之间传递数据。
- 通过状态库管理全局状态，如 Redux、Mobx。
- 通过 EventEmitter 让父子组件之间互相订阅。

不推荐的方式：

- `useImperativeHandle` 暴露子组件给父组件。不推荐使用，因为会破坏封装性。
- 父组件通过 useRef 获取子组件实例或者 Dom 元素。

## React 生命周期

### 旧版生命周期

- `componentWillMount`：组件挂载前调用。
- `componentDidMount`：组件挂载后调用。
- `componentWillReceiveProps`：组件接收到新的 props 时调用。
- `shouldComponentUpdate`：组件接收到新的 props 或者 state 时调用，用于判断是否需要重新渲染。
- `componentWillUpdate`：组件更新前调用。
- `componentDidUpdate`：组件更新后调用。
- `componentWillUnmount`：组件卸载前调用。
- `componentDidCatch`：组件发生错误时调用。
- `componentWillReceiveProps`：组件接收到新的 props 时调用。

### 新版生命周期

- `constructor`：构造函数。
- `static getDerivedStateFromProps`：静态方法，用于派生状态。
- `render`：渲染函数。
- `componentDidMount`：组件挂载后调用。
- `shouldComponentUpdate`：组件接收到新的 props 或者 state 时调用，用于判断是否需要重新渲染。
- `getSnapshotBeforeUpdate`：在更新 DOM 之前获取快照。
- `componentDidUpdate`：组件更新后调用。
- `componentWillUnmount`：组件卸载前调用。
- `componentDidCatch`：组件发生错误时调用。
- `componentDidCatch`：组件接收到新的 props 时调用。

## React 性能优化

### 优化策略

- 使用 `React.memo` 缓存组件。
- 使用 `useMemo` 缓存计算结果。
- 使用 `useCallback` 缓存函数。
- 使用 `useRef` 缓存 DOM 元素或变量。
- 使用 `useLayoutEffect` 替代 `useEffect`。
- 使用 `React.lazy` 和 `React.Suspense` 实现组件懒加载。
- 使用 `React.PureComponent` 代替 `Component`。
- 使用 `shouldComponentUpdate` 避免不必要的渲染。
- 使用 `React.createContext` 代替 `props` 传递数据。
