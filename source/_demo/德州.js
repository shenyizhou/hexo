function shuffle(array, num = array.length) {
    const tempArr = [...array];
    for (let i = 0; i < num; i++) {
        const j =
            tempArr.length -
            1 -
            Math.floor(Math.random() * (tempArr.length - i));
        [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
    }
    return tempArr.slice(0, num);
}

const singleList = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
// const singleList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const multiList = [...singleList, ...singleList, ...singleList, ...singleList];
const getType = (index) => {
    if (index < 13) {
        return '黑桃';
    }
    if (index < 26) {
        return '红桃';
    }
    if (index < 39) {
        return '梅花';
    }
    return '方片';
};
// const getType = (index) => {
//     if (index < 13) {
//         return '♠';
//     }
//     if (index < 26) {
//         return '♥';
//     }
//     if (index < 39) {
//         return '♣';
//     }
//     return '♦';
// };
const deck = multiList.map((value, index) => `${getType(index)}${value}`);
// const deck = multiList.map((value, index) => [getType(index), value]);
console.log(deck);

const getPower = (arr = []) => {
    let res = '';
    const newArr = arr.map((v) => {
        const type = v.slice(0, 2);
        const number = ((num) => {
            if (num === 'K') {
                return 13;
            }
            if (num === 'Q') {
                return 12;
            }
            if (num === 'J') {
                return 11;
            }
            if (num === 'A') {
                return 1;
            }
            return Number(num);
        })(v.slice(2, 4));
        return [type, number];
    });
    const lens = {
        黑桃: 0,
        红桃: 0,
        梅花: 0,
        方片: 0
    };
    for (let i = 0; i < newArr.length; i++) {
        const [type, number] = newArr[i];
        lens[type]++;
    }
    Object.keys(lens).forEach((key) => {
        if (lens[key] >= 5) {
            res = `同花 ${key}`;
        }
    });

    return res;
};

const draw = (times) => {
    for (let i = 0; i < times; i++) {
        const arr = shuffle(deck, 7);
        const res = getPower(arr);
        console.log(arr, res);
    }
};

draw(500);
