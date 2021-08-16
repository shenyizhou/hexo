import { permutations } from 'itertools';

const 融合 = 1;
const 龙族 = 2;
const 布雷达 = 4;
const 魔神王 = 5; // 同时兼具融合和布雷达的功能，即 1 + 4

const 融合卡数 = 6; // 只能作为融合，包括融合和融合之门
const 布雷达卡数 = 4; // 只能作为布雷达，包括布雷达和他的魔法，以及融合素材卡，因为融合素材卡不能作为龙族卡
const 魔神王卡数 = 3;
const 卡组总数 = 20;
// const 卡组总数 = 融合卡数 + 龙族卡数 + 布雷达卡数 + 魔神王卡数;
const 龙族卡数 = 卡组总数 - (融合卡数 + 布雷达卡数 + 魔神王卡数);
const deck = [
    ...Array.from({ length: 融合卡数 }).map((_) => 融合),
    ...Array.from({ length: 龙族卡数 }).map((_) => 龙族),
    ...Array.from({ length: 布雷达卡数 }).map((_) => 布雷达),
    ...Array.from({ length: 魔神王卡数 }).map((_) => 魔神王)
];

let 抽卡次数 = 5;
const 抽卡 = permutations(deck, 抽卡次数);
let 手卡 = 抽卡.next().value;
let 成功展开次数 = 0;
let 失败次数 = 0;

// 直到最后一种可能性，不停模拟抽卡
while (手卡) {
    // 先考虑大概率事件，没有龙族必定失败
    if (!手卡.includes(2)) {
        失败次数 += 1;
    } else {
        // 在已经有龙族的情况下如何成功？有融合+布雷达，或者有融合+魔神王，或者有布雷达+魔神王
        if (
            (手卡.includes(1) && 手卡.includes(4)) ||
            (手卡.includes(1) && 手卡.includes(5)) ||
            (手卡.includes(2) && 手卡.includes(5))
        ) {
            成功展开次数 += 1;
        } else {
            失败次数 += 1;
        }
    }
    // 进行下一波抽卡
    手卡 = 抽卡.next().value;
}
console.log(
    '成功展开次数：',
    成功展开次数,
    '，失败次数：',
    失败次数,
    '成功展开概率：',
    `${(成功展开次数 / (成功展开次数 + 失败次数)) * 100}%`
);
