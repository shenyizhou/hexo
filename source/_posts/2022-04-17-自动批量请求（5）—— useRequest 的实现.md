---
title: 自动批量请求（5）—— useRequest 的实现
date: 2022-04-17 12:41:51
categories:
    - 前端综合
tags:
    - 请求
---

经过以上几篇文章，已经可以很好地处理 batch 请求的场景了。

但是每次还是得手动处理 loading 和 error，不够方便。

况且现在已经是 hooks 的时代了，本文便引入了 useRequest 的概念。

## useRequest 的使用

我们对 useFetch 的使用习惯肯定是要符合我们对 hooks 的直觉，如此这般：

```js
const { data, loading, error } = useRequest(
    { url: 'url', data: {}, ...options },
    [...deps]
);
```

然后直接使用 data 渲染数据和控制空态，用 loading 展示加载态，用 error 展示错误态和错误信息。

由此见得，`useRequest` 的使用场景，主要是查询类的被动请求，像是点击操作这类的主动请求不太适合。

## useRequest 的实现

`useRequest` 的实现原理也很简单，相当于是自定义 hooks，如下：

```typescript
/**
 * 被动触发的 fetch hooks
 * @param param0 请求地址 url，请求参数 data，以及其他配置参数，如请求频次 frequence
 * @param deps 依赖数组
 */
export const useRequest = (
    { url, data }: IUseRequestProps,
    deps: any[] = []
) => {
    const stringifyData = JSON.stringify(data); // 序列化，因为是依赖，防止 immutable 对象无限刷新
    const [state, setState] = useState<IObject | null>(null); // 数据
    const [loading, setLoading] = useState(true); // 是否加载中
    const [error, setError] = useState(''); // 错误文本

    useEffect(() => {
        setLoading(true);
        fetchBatch(
            url,
            {
                data: JSON.parse(stringifyData)
            },
            (res: IObject) => {
                withBatch(() => {
                    setState(res);
                    setLoading(false);
                });
            },
            (err: Error) => {
                withBatch(() => {
                    setError(err.message);
                    setLoading(false);
                });
            }
        );
    }, [url, stringifyData, ...deps]);

    return {
        data: state,
        loading,
        error
    };
};
```

## 额外功能

上文只是实现了最基础的功能，在实际使用中经常会不满足需求，于是又产生了下文的几个功能点。

### 主动修改数据

因为数据是存在黑盒里的，用户无法进行受控的修改，所以其实可以把 `setState` 给暴露出去。

### 主动控制触发

增加 `manual` 配置和 `run` 方法。

### 请求频次

因为是 hooks 的写法，只有依赖更新的时候才会重新发请求，这样的话一些轮询的接口需要借助一个布尔值，定时器每次对布尔值取反来实现，这样很不优雅。

可以增加一个 `frequncy` 参数，内置一个定时器发送的功能。

### 延迟展示的额外数据

某些场景下，我们可能需要一些数据在请求返回结果之后再一起更新，而这些数据不是从返回结果里取的，而是我们手动设置的。

这时候如果我们通过 `loading` 来进行判断会过于复杂，所以也可以增加一个 `extraData` 的功能。

### SWR

即请求缓存的功能，在请求回来之前，不是展示空数据，而是展示上一次同样正确请求的数据来预先展示。

这个功能需要用个有 `getCache` 和 `setCache` 的库来实现即可，本文用的是 `localStorage` 的实现方式。

将以上几点修改后，代码如下：

```typescript
/**
 * useRequest 参数
 */
interface IUseRequestProps {
    url: string; // 请求地址
    data: IObject; // 请求参数
    extraData?: IObject; // 额外数据，随着返回数据一起更新
    frequence?: number; // 请求频次，单位为毫秒
    manual?: boolean; // 是否手动触发
}

/**
 * 被动触发的 fetch hooks
 * @param param0 请求地址 url，请求参数 data，以及其他配置参数，如请求频次 frequence
 * @param deps 依赖数组
 */
export const useRequest = (
    {
        url, data, extraData = {}, frequence = -1, manual = false
    }: IUseRequestProps,
    deps: any[] = []
) => {
    // 序列化，因为是依赖，防止 immutable 对象无限刷新
    const stringifyData = JSON.stringify(data); // 请求参数
    const stringifyExtraData = JSON.stringify(extraData); // 额外数据，随着返回数据一起更新
    const localData = localStorage.getItem(`${url}/${stringifyData}`);
    const [state, setState] = useState<any>(localData ? JSON.parse(localData) : null); // 返回数据
    const [loading, setLoading] = useState(!manual); // 加载中
    const [error, setError] = useState(''); // 错误文本

    // 因为要加定时器逻辑，所以单独抽离出来
    const onFetch = useCallback(() => {
        fetchBatch(
            url,
            {
                data: JSON.parse(stringifyData)
            },
            (res: any) => {
                withBatch(() => {
                    const result = { ...res, ...JSON.parse(stringifyExtraData) };
                    setLoading(false);
                    setState(result);
                    localStorage.setItem(`${url}/${stringifyData}`, JSON.stringify(result)); // 缓存数据到本地
                });
            },
            (err: Error) => {
                withBatch(() => {
                    setLoading(false);
                    setError(err.message);
                });
            }
        );
    }, [url, stringifyData, stringifyExtraData]);

    useEffect(() => {
        setLoading(true);
        onFetch();

        // 定时器逻辑
        if (frequence && frequence !== -1 && Number.isInteger(frequence)) {
            const timer = setInterval(onFetch, Math.max(frequence, 1000));

            return () => {
                clearInterval(timer);
            };
        }

        return () => {};
    }, [onFetch, frequence, ...deps]);

    return {
        data: state,
        setData: setState,
        loading,
        error,
        run: onFetch
    };
};
```
