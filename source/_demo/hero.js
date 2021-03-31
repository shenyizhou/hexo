function getPerHero(per = 50) {
    [
        ...document.getElementsByClassName('vxe-table--body')[1].children[1]
            .children
    ]
        .map((child) => {
            const arr = [...child.children];
            const avatarItem = arr[0].children[0].children[0].children;
            const avatar = [...avatarItem].filter((i) => i.src)[0].src;
            const img = `padding: 10px 10px;background-image: url(${avatar});background-size: contain;background-repeat: no-repeat;color: transparent;`;
            const perUse = Number(arr[3].children[0].children[0].innerHTML);
            const perWin = Number(arr[5].children[0].children[0].innerHTML);
            const perOppoLose =
                (per - (perUse * perWin) / 100) /
                (1 - Math.min(perUse, 99.99) / 100);
            return {
                img,
                perUse,
                perWin,
                p: perOppoLose
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
        .forEach(({ img, perUse, perWin, p }) => {
            console.log(
                '%c+',
                img,
                `${(100 - p).toFixed(2)}%`,
                `${perWin}%/${perUse}%`
            );
        });
}
