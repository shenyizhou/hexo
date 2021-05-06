const useLastMemo = (callback, deps = []) => {
    const [value, setValue] = useState(callback());

    useEffect(() => {
        setValue(callback(value));
    }, deps);

    return value;
}