// 40 张卡组的总次数太多太慢
// import { permutations } from 'itertools';

// 洗牌算法
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

export default shuffle;

// 先罗列下特性
// 影依、融合、光属性怪兽、卡组拉怪卡
const 影依 = 1;
const 融合 = 2;
const 光属性 = 4;
const 卡组拉怪 = 8;
const 温蒂 = 1 + 8;
const 凯乌斯 = 1 + 4;
const 其他 = 0;

const 温蒂s = 3;
const 影依s = 10;
const 凯乌斯s = 1;
const 融合s = 8;
const 光属性s = 7;
const 卡组拉怪s = 9;
const 其他s = 48 - 影依s - 融合s - 光属性s - 卡组拉怪s - 温蒂s - 凯乌斯s;

// 总次数： 10000000 手融拿非利： 2846406 28.46% 温蒂拖兽开次数： 6107225 61.07% 多个融合次数： 3.67% 成功展开概率： 93.21%
// 总次数： 10000000 手融拿非利： 3032625 30.33% 温蒂拖兽开次数： 5971868 59.72% 多个融合次数： 3.41% 成功展开概率： 93.45%

console.log('其他卡数：', 其他s);

const deck = [
    ...Array.from({ length: 温蒂s }).map((_) => 温蒂),
    ...Array.from({ length: 凯乌斯s }).map((_) => 凯乌斯),
    ...Array.from({ length: 卡组拉怪s }).map((_) => 卡组拉怪),
    ...Array.from({ length: 融合s }).map((_) => 融合),
    ...Array.from({ length: 光属性s }).map((_) => 光属性),
    ...Array.from({ length: 影依s }).map((_) => 影依),
    ...Array.from({ length: 其他s }).map((_) => 其他)
];

let 抽卡次数 = 5;
let 手卡 = shuffle(deck, 抽卡次数);
let 总次数 = 0;
let 温蒂拖兽开次数 = 0;
let 手融拿非利次数 = 0;
let 多个融合次数 = 0;
let 失败次数 = 0;

// 直到最后一种可能性，不停模拟抽卡
while (总次数 < 10000000) {
    if (
        (手卡.includes(影依) || 手卡.includes(凯乌斯) || 手卡.includes(温蒂)) &&
        (手卡.includes(光属性) || 手卡.includes(凯乌斯)) &&
        手卡.includes(融合)
    ) {
        手融拿非利次数 += 1;
    } else if (手卡.includes(卡组拉怪) || 手卡.includes(温蒂)) {
        温蒂拖兽开次数 += 1;
    } else if (手卡.filter((卡) => 卡 === 融合).length >= 2) {
        多个融合次数 += 1;
    } else {
        失败次数 += 1;
    }
    总次数 += 1;
    if (总次数 % 1000000 === 0) {
        console.log(
            // '总次数：',
            // 总次数,
            '展开',
            `${(((总次数 - 失败次数) / 总次数) * 100).toFixed(2)}%`,
            '温蒂',
            // 温蒂拖兽开次数,
            `${((温蒂拖兽开次数 / 总次数) * 100).toFixed(2)}%`,
            '拿非利',
            // 手融拿非利次数,
            `${((手融拿非利次数 / 总次数) * 100).toFixed(2)}%`,
            '融合卡手',
            `${((多个融合次数 / 总次数) * 100).toFixed(2)}%`,
        );
    }
    // 进行下一波抽卡
    手卡 = shuffle(deck, 抽卡次数);
}
