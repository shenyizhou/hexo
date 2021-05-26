function getPer(per = 50) {
    [
        ...document.getElementsByClassName('vxe-table--body')[2].children[1]
            .children
    ]
        .map((child) => {
            const arr = [...child.children];
            const img = `padding: 10px 10px;background-image: url(${arr[1].children[0].children[0].src});background-size: contain;background-repeat: no-repeat;color: transparent;`;
            const perUse = Number(arr[4].children[0].children[0].innerHTML);
            const perWin = Number(arr[5].children[0].children[0].innerHTML);
            const perOppoLose =
                (per - (perUse * perWin) / 100) /
                (1 - Math.min(perUse, 99.99) / 100);
            return {
                img,
                p: perOppoLose,
                perWin
            };
        })
        .sort((a, b) => {
            if (a.p < b.p) {
                return -1;
            }
            if (a.p > b.p) {
                return 1;
            }
            return 0;
        })
        .forEach(({ img, p, perWin }) => {
            console.log('%c+', img, `${(100 - p).toFixed(2)}%`, `${perWin}%`);
        });
}
