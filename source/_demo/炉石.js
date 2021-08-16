// 访问地址:
// https://hsreplay.net/cards/?modal=premium#playerClass=PALADIN&timeRange=LAST_1_DAY&sortBy=drawnWinrate&rankRange=DIAMOND_THROUGH_LEGEND

const LEN = 60000;
const WIN = 55;
var titleDom = [
    ...document.getElementsByClassName('table-container')?.[0]?.children?.[0]
        ?.children?.[3]?.children?.[0]?.children?.[0].children
];

var listDom = [
    ...document.getElementsByClassName('table-container')?.[0]?.children?.[0]
        ?.children?.[4].children?.[0]?.children?.[0]?.children
];

var listValue = listDom.map((item) =>
    Number(item?.innerText?.split(',')?.join('')?.split('%')?.join(''))
);

var resultTitle = titleDom
    .map((item) => item?.children?.[0]?.children?.[0]?.children?.[0])
    .map((item) => ({
        cost: Number(item?.children?.[0]?.children?.[0].innerText),
        name: item?.getAttribute('aria-label'),
        gold: item?.children?.[1]?.children.length > 3
    }));

var resultList = listValue.reduce(
    (prev, cur, index) => {
        let { list, current } = prev || { list: [], current: {} };
        switch (index % 4) {
            case 0:
                current.count = cur;
                break;
            case 1:
                current.firstWin = cur;
                current.firstNotLose = Number(
                    (
                        100 -
                        ((WIN - (cur * current.count) / LEN) /
                            (LEN - current.count)) *
                            LEN
                    ).toFixed(2)
                );
                break;
            case 2:
                current.drawWin = cur;
                current.drawNotLose = Number(
                    (
                        100 -
                        ((WIN - (cur * current.count) / LEN) /
                            (LEN - current.count)) *
                            LEN
                    ).toFixed(2)
                );
                break;
            case 3:
                current.len = cur;
                current.win = Number(
                    ((current.firstNotLose + current.drawNotLose) / 2).toFixed(2)
                );
                list.push(current);
                current = {};
                break;
            default:
                break;
        }
        return { list, current };
    },
    { list: [], current: {} }
);

var resultFinal = resultTitle
    .map((item, index) => ({
        win: resultList.list?.[index]?.win,
        ...item,
        ...resultList.list?.[index]
    }))
    .sort((a, b) => (a.win < b.win ? 1 : -1));

var deckLen = 0;
var deck = { len: 0 };

for (var i = 0; deckLen < 30; i++) {
    const { gold, name, cost, len } = resultFinal[i] || {};
    const num = gold || deckLen >= 29 ? 1 : 2;
    const text = `${name} * ${num}`;
    if (deck[cost]) {
        deck[cost].push(text);
    } else {
        deck[cost] = [text];
    }
    deck.len += len * num;
    deckLen += num;
}

deck.len = Number((deck.len / 30).toFixed(2));

console.log(resultFinal, deck);
