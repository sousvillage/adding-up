'use strict';
// ↓データ読み取り、変数変換
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => { // ↓必要データの選択
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture); // 連想配列のデータ取得先指定
        if (!value) {
            value = {
                popu10: 0, // 2010年の人口
                popu15: 0, // 2015年の人口
                change: null // 人口の変化率
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value); // 連想配列の作成
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        // 人口変化率の計算
        value.change = value.popu15 / value.popu10;
    }
    // 人口増加率を降順に並び変え
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // 配列を整形する
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});