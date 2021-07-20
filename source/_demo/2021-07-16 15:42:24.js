function find(a) {
    return [0, 2, 6, 20, 34]
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => a > value)
        .pop();
}
