function getMedal() {
    [
        ...document.getElementsByClassName('vxe-table--body')[0].children[1]
            .children
    ]
        .map((child) => {
            const arr = [...child.children];
            const avatarItem = arr[0].children[0].children[0].children;
            const avatar = [...avatarItem].filter((i) => i.src)[0].src;
            const img = `padding: 10px 10px;background-image: url(${avatar});background-size: contain;background-repeat: no-repeat;color: transparent;`;
            const perUse = Number(arr[4].children[0].children[0].innerHTML);
            const perWin = Number(arr[6].children[0].children[0].innerHTML);
            const perGold = Number(arr[8].children[0].children[0].innerHTML);
            const perSilver = Number(arr[9].children[0].children[0].innerHTML);
            const perOppoLose =
                (50 - (perUse * perWin) / 100) /
                (1 - Math.min(perUse, 99.99) / 100);
            const count =
                (20 * perWin -
                    17 * (100 - perWin) +
                    perGold * 5 +
                    perSilver * 2) /
                100;
            return {
                img,
                perUse,
                perWin,
                perGold,
                perSilver,
                p: perOppoLose,
                count
            };
        })
        .sort((a, b) => {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        })
        .forEach(({ img, count, perGold, perSilver, perWin, p }) => {
            console.log(
                '%c+',
                img,
                `${count.toFixed(2)}分`,
                // `${(100 - p).toFixed(2)}%`,
                `${perWin}%/${perGold}🏅/${perSilver}🥈`
            );
        });
}
