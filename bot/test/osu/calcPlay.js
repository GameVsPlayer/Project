const chai = require('chai');
const path = require("path");




let Mods = ["HD", "HR"];
let dotnet = '';
for (let mod in Mods) {
    dotnet = dotnet + `-m ${Mods[mod]} `;
}
let play = {
    "beatmap_id": "129891",
    "score_id": "2177560145",
    "score": "132408001",
    "maxcombo": "2385",
    "count50": "0",
    "count100": "5",
    "count300": "1978",
    "countmiss": "0",
    "countkatu": "4",
    "countgeki": "247",
    "perfect": "1",
    "enabled_mods": "24",
    "user_id": "124493",
    "date": "2016-09-20 01:51:49",
    "rank": "SH",
    "pp": "894.388",
    "replay_available": "1"
}
let playStats = {
    combo: play.maxcombo,
    count100: play.count100,
    count50: play.count50,
    misses: play.countmiss

}

const calcPlay = require("../../built/externalLoading/extra").osu.calcPP(null, path.join(__dirname + "/maps/1.osu"), playStats, dotnet, "osu");

const calcMap = require("../../built/externalLoading/extra").osu.calcMap(null, path.join(__dirname + "/maps/1.osu"), dotnet, "osu");


let count = 0,
    sr = 0;


describe('osu', function () {
    before(async function () {
        let res = await calcPlay;
        count = parseInt(res.pp);
    })
    it('Test PP Calculator for a Play', function () {
            chai.expect(count).closeTo(900, 200);
        }),
        before(async function () {
            let res = await calcMap;
            sr = parseFloat(res[0]);
        })
    it('Test PP Calculator for map Diff', function () {
        chai.expect(sr).closeTo(7.80, 0.3);
    })
});