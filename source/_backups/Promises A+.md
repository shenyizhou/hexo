# Promises/A+ 标准

1. `promise` 是包含标准 `then` 方法的对象
2.

## promise 的三个状态

![状态](https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/7158368121/c2c1/bfc9/22d2/1e9ff1b4071d0e91f1142f852764f480.png)

-   一个 `promise` 初始状态为 `pending`
-   一个 `promise` 从 `pending` 变为 `fulfilled` 必须有一个不能更改的 `value`，且无法再变为其他状态
-   一个 `promise` 从 `pending` 变为 `rejected` 必须有一个不能更改的 `reason`，且无法再变为其他状态

## onFulfilled 和 onRejected

-   `onFulfilled` 或 `onRejected` `function`
-   `onFulfilled` 或 `onRejected` 是 会在微任务或宏任务中被异步调用
-   `onFulfilled` 或 `onRejected` 中没有 `this`

### onFulfilled

-   `onFulfilled` 只能在 `promise` 变为 `fulfilled` 时被调用一次
-   `onFulfilled` 会把 `promise` 的 `value` 作为第一个回调参数

### onRejected

-   `onRejected` 会把 `promise` 的 `reason` 作为第一个回调参数
-   `onRejected` 只能在 `promise` 变为 `rejected` 时被调用一次

## then

-   `.then(onFulfilled, onRejected)`
-   `onFulfilled` 或 `onRejected` 不为 `function` 时会被忽略
