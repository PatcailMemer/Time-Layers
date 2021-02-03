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
  //u11 unlocks SpaceTime
  u12() {
    let ret = EN(1)
    if (hasSTF(15)) ret = ret.add(caplog10square(game.spaceComp))
    else ret = ret.add(game.spaceComp.min(12))
    ret = ret.times(0.015)
    return ret
  },
  //u13 is just a 3x mult
  u14() {
    let ret = 2.25
    if (game.SEU.includes(9)) ret *= 10
    return ret
  },
  //u15 applies only to u12
  u16() {
    let ret = game.timeFoam.pow(getNormalEnergyRow2Mult().div(2))
    return ret.max(1)
  },
  //u17 is only applied once and is basically self-contained.
  //u18 is used only to call the SpaceTimeComp Effect function.

  //u21 unlocks Energy
  u22() {
    let ret = EN(0.015)
    ret = ret.times(1 + hasSTF(25) + hasSTF(28))
    ret = ret.times(game.spacetimeComp)
    return ret.add(1)
  },
  //u23 is just a 3x mult
  u24() {
    if (inGalChal(2)) return 1
    return game.spaceEnergy.max(1)
  },
  //u25 only applies to u22
  u26() {
    let ret = game.spacetime.max(1).log10().div(100)
    ret = ret.times(getNormalEnergyRow2Mult())
    if (game.nucleoUps.includes(1)) ret = ret.times(getNucleoEffect(1))
    return ret
  },
  //u27 is legit just an e50 multiplier. gimme a break. 
  //u28 only applies to u22

  //u31 unlocks Space Foam
  u32() {
    let ret = game.tempComp.times(0.015 * (1 + hasSTF(33)))
    if (hasSTF(33)) ret = ret.times(getSpaceEnergyRow1Mult())
    return ret
  },
  //u33 is just a 2x mult
  u34() {
    return Math.min(Math.max(game.spaceTimeFoamUpgrade.length - 9,1),9)
  }
  //u35 unlocks Stars
  //u36 is effectively QoL
  //u37: return getTempCompBase()

}

function hasSTF(x, thing=false) {
  if (game.spaceless && (!thing) && x !== 11 && x <= 19) return false
  return game.spaceTimeFoamUpgrade.includes(x+"")
}

function getTempCompCost() {
  if (game.tempComp.gte(21) && inGalChal(2)) return EN(Infinity)
  if (game.tempComp.gte(21) && inGalChal(5)) return EN(Infinity)
  if (game.tempComp.gte(18) && inGalChal(4)) return EN(Infinity)
  if (game.tempComp.gte(19) && inGalChal(3)) return EN(Infinity)

  let TCC = EN(20).times(EN(1.5).pow(game.tempComp.pow(1.5)))
  if (hasSTF(13)) TCC = TCC.div(getSpaceEnergyRow1Mult().times(3))
  if (hasSTF(14)) TCC = TCC.div(suMults["u14"]())
  if (inGalChal(4)) TCC = TCC.times(10)
  return TCC
}

function getSpaceCompCost(bulk=1) {
  let SCC = EN(0.2)
  SCC = SCC.times(EN(1.5).pow(game.spaceComp.add(bulk).minus(1).pow(1.5)))
  if (hasSTF(23)) SCC = SCC.div(EN(3).times(getSpaceEnergyRow1Mult()))
  if (hasSTF(14)) SCC = SCC.div(suMults["u14"]())
  return SCC
}

function getSpaceTimeRate() {
  let STR = getTempCompEffect()
  STR = STR.times(game.spaceFoam)
  if (hasSTF(33)) STR = STR.times(2)
  if (hasSTF(13)) STR = STR.times(getSpaceEnergyRow1Mult())
  if (game.achievement.includes(16)) STR.times(10)
  if (hasSTF(27)) STR.times(1e50)
  if (game.nucleoUps.includes(2)) STR = STR.times(getNucleoEffect(2))
  if (game.spaceless) STR = STR.div(1e60)
  if (inGalChal(1)) STR = STR.div(1e50)
  if (starMile(16) && game.spaceless && inGalChal(1)) STR.times(1e55)
  STR = STR.times(game.perspectivePower.max(1))
  STR = STR.times(getSuperNovaEffect(2))
  return STR
}

function getSpaceTimeCost() {
  let STC = EN(20)
  STC = STC.times(EN(1.5).pow(EN(1.5).pow(game.spacetimeComp))) //1.5 ^ (1.5 ^ X), X = SpaceTime bought. 
  if (hasSTF(14)) STC = STC.div(suMults["u14"]() ** 2)
  if (game.achievement.includes(38)) STC = STC.div("e999")
  return STC
}
function buySpaceTimeComp() {
  if (game.spacetime.gte(getSpaceTimeCost())&&!inGalChal(5)) {
    game.spacetime=game.spacetime.minus(getSpaceTimeCost())
    game.spacetimeComp = game.spacetimeComp.add(1)
  }
}

function getSpacetimeCompEffect() {
  let SCE = game.spacetimeComp
  if (hasSTF(22)) SCE = SCE.times(suMults["u22"]())
  if (game.achievement.includes(28)) SCE = SCE.times(1.19)
  return SCE
}

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

function getTempCompEffect() {
  let TCExp = caplog10(game.tempComp).min(15)
  TCExp = TCExp.add(caplog10(getSpacetimeCompEffect()))
  if (!inGalChal()) TCExp = TCExp.add(game.superComp.temp)

  return getTempCompBase().pow(TCExp)
}

function getTempCompBase() {
  let TCB = EN(1.1)
  if (hasSTF(12)) TCB = TCB.add(suMults["u12"]()) //Space Compression boosts time Compression
  if (game.achievement.includes(28)) TCB = TCB.add(0.19)
  return TCB
}

let caplog10square = x => x.lte(12) ? x : x.log10().pow(2).times(10)

let getSpaceCompEffect = () => getSpaceCompBase().pow(game.spaceComp.add(getSpacetimeCompEffect()))

function getSpaceCompBase() {
  if (inGalChal(2)) return getStarEffect().times(1.1)
  let SCB = EN(1.1)

  if (hasSTF(32)) SCB = SCB.add(suMults["u32"]())
  if (game.achievement.includes(18)) SCB = SCB.add(0.09)

  if (hasSTF(26)) SCB = SCB.add(suMults["u26"]())
  if (hasSTF(17)) SCB = SCB.add(game.spaceComp.times(0.03)) //Space Compressors boost themselves
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