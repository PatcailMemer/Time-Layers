"use strict"

const suCosts = {
  u11: 2,
  u12: 1.25,
  u13: 1.5,
  u14: 10,
  u15: 15,
  u16: 45,
  u17: 240,
  u18: 600,

  u21: 2e6,
  u22: 20000,
  u23: NaN,
  u24: 11,
  u25: 14,
  u26: 16,
  u27: "e1050",
  u28: "e10500",

  u31: 200,
  u32: 500,
  u33: 5000,
  u34: 10,
  u35: 20,
  u36: NaN,
  u37: NaN,
  u38: NaN
}
const suMults = {
  u11(s) { 
    return getSpaceTimeRate().times(s)
  },
  u12() {
    var ret = EN(1)
    if (hasSTF(15)) ret = ret.add(caplog10square(game.spaceComp))
    else ret = ret.add(game.spaceComp.min(12))
    ret = ret.times(0.015)
    return ret
  }
}

function hasSTF(x, thing=false) {
  if (game.spaceless && (!thing) && x !== 1 && x <= 9) return false
  return game.spaceTimeFoamUpgrade.includes(x+"")
}

function getTempCompCost() {
  if (game.tempComp.gte(21) && inGalChal(2)) return EN(Infinity)
  if (game.tempComp.gte(21) && inGalChal(5)) return EN(Infinity)
  if (game.tempComp.gte(18) && inGalChal(4)) return EN(Infinity)
  if (game.tempComp.gte(19) && inGalChal(3)) return EN(Infinity)

  let TCC = EN(20).times(EN(1.5).pow(game.tempComp.pow(1.5)))
  if (hasSTF(13)) TCC = TCC.div(getSpaceEnergyRow1Mult().times(3))
  if (hasSTF(14)) TCC = TCC.div(2.25 * (game.SEU.includes(9) ? 10 : 1))
  if (inGalChal(4)) TCC = TCC.times(10)
  return TCC
  /*return EN(20)
    .times(EN(1.5).pow(game.tempComp.pow(1.5)))
    .div(1 + 2 * hasSTF(13))
    .div(hasSTF(13) ? getSpaceEnergyRow1Mult() : 1)
    .div(hasSTF(14) ? 2.25 * (game.SEU.includes(9) ? 10 : 1) : 1)
    .times(inGalChal(4) ? 10 : 1)
    */
}

let getSpaceCompCost = (bulk=1) => EN(0.2).times(EN(1.5).pow(game.spaceComp.add(bulk).minus(1).pow(1.5)))
    .div(EN(1 + 2 * hasSTF(23)).times(hasSTF(23) ? getSpaceEnergyRow1Mult() : 1))
    .div(hasSTF(14) ? 2.25 * (game.SEU.includes(9) ? 10 : 1) : 1)


let getSpaceTimeRate = () => getTempCompEffect().times(game.spaceFoam).times(1+hasSTF(33)).times(hasSTF(13) ? getSpaceEnergyRow1Mult() : 1)
    .times(game.achievement.includes(16)?10:1)
    .times(hasSTF(27)?1e50:1)
    .times(game.nucleoUps.includes(2)?getNucleoEffect(2):1)
    .times(getNucleoEffect(2).pow(game.galaxies[0].pow(getNucleoEffect(3))))
    .div(game.spaceless?1e60:1)
    .div(inGalChal(1)?1e50:1)
    .times(starMile(16)&&game.spaceless&&inGalChal(1)?1e55:1)
    .times(game.perspectivePower.max(1))
    .times(getSuperNovaEffect(2))

let getSpaceTimeCost = () => EN(20)
  .times(EN(1.5).pow(EN(1.5).pow(game.spacetimeComp)))
  .div(hasSTF(14)?2.25**2*(game.SEU.includes(9)?100:1):1)
  .div(game.achievement.includes(38)?"e999":1)

function buySpaceTimeComp() {
  if (game.spacetime.gte(getSpaceTimeCost())&&!inGalChal(5)) {
    game.spacetime=game.spacetime.minus(getSpaceTimeCost())
    game.spacetimeComp = game.spacetimeComp.add(1)
  }
}

let getSpacetimeCompEffect = () => game.spacetimeComp
    .times(hasSTF(22)?EN(1).add(EN(0.015).times(1+hasSTF(25)*(1+hasSTF(28))).times(game.spacetimeComp)):1)
    .times(game.achievement.includes(28)?1.19:1)

let caplog10 = x => x.gte(10) ? x.log10().times(10) : x

function buySpaceComp(bulk=1) {
  if (game.spaceFoam.gte(getSpaceCompCost(bulk))&&(!game.spaceless)) {
    game.spaceFoam=game.spaceFoam.minus(getSpaceCompCost(bulk))
    game.spaceComp = game.spaceComp.add(bulk)
  }
}

function buyTempComp() {
  if (game.timeFoam.gte(getTempCompCost())) {
    game.timeFoam=game.timeFoam.minus(getTempCompCost())
    game.tempComp = game.tempComp.add(1)
  }
}

let getTempCompEffect = () => getTempCompBase().pow(caplog10(game.tempComp).min(15).add(caplog10(getSpacetimeCompEffect())).add(inAnyGalChal()?0:game.superComp.temp))

function getTempCompBase() {
  let TCB = EN(1.1)
  if (hasSTF(12)) TCB = TCB.add(suMults["u12"]())
  if (game.achievement.includes(28)) TCB = TCB.add(0.19)
  return TCB
}

let caplog10square = x => x.lte(12) ? x : x.log10().pow(2).times(10)

let getSpaceCompEffect = () => getSpaceCompBase().pow(game.spaceComp.add(getSpacetimeCompEffect()))

function getSpaceCompBase() {
  if (inGalChal(2)) return getStarEffect().times(1.1)
  let SCB = EN(1.1)
  if (hasSTF(32)) SCB = SCB.add(game.tempComp.times(0.015 * (1 + hasSTF(33))).times(hasSTF(33) ? getSpaceEnergyRow1Mult() : 1))
  if (game.achievement.includes(18)) SCB = SCB.add(0.09)
  if (hasSTF(26)) {
    SCB = SCB.add(game.spacetime.max(1).log10().div(100)
    .times(game.nucleoUps.includes(1) ? getNucleoEffect(1) : 1)
    .times(getNormalEnergyRow2Mult()))
  }
  if (hasSTF(17)) SCB = SCB.add(game.spaceComp.times(0.03))
  SCB = SCB.times(getStarEffect()).times(getSuperNovaEffect(1))
  return SCB
}

function canBuySpaceTimeUpgrade(x,y) {
  if (game.spaceTimeFoamUpgrade.includes(x+""+y)) return false
  let currency = ""
  currency = [null, "spaceFoam","spacetime","timeFoam"][x]
  if (y>=4) currency = [null,"spaceComp", y <= 6 ? "spacetimeComp" : "spacetime", "tempComp"][x]
  if (currency === undefined) return false
  return game[currency].gte(suCosts["u" + x + y])
}

function buySpaceTimeUpgrade(x,y) {
  let currency = ""
  if (canBuySpaceTimeUpgrade(x,y)) { 
    currency = [null, "spaceFoam","spacetime","timeFoam"][x]
    if (y>=4) currency = [null, "spaceComp", y <= 6 ? "spacetimeComp" : "spacetime", "tempComp"][x]
    game[currency]=game[currency].minus(suCosts["u" + x + y])
    game.spaceTimeFoamUpgrade.push(x+""+y)
  }
}