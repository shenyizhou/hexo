# 在 React 中使用自动合并来减少渲染

React 18 通过执行更多默认的合并操作来增加开箱即用的性能提升，使得用户无需再手动合并。

这篇文章将解释什么是合并，他之前是怎么工作的，以及最新版发生了什么变化。

> 注意：这是一个我们不希望用户深入去考虑的功能。但是，他可能会与教育者或基础库开发者有关。

## 什么是合并

合并是 React 将多次状态更新黑成一个单独的渲染，来获得更好的性能。

比如说，如果你在同一次点击事件中，有两次状态更新，那么 React 总是会把他们都放到同一次渲染中。

如果你运行下面的代码，你讲会看到每次点击时，React 只执行一次渲染，尽管你设置了两次状态：

```JavaScript
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not re-render yet
    setFlag(f => !f); // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

[在线演示地址](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js)(注意看 Console 输出的 render 次数)


