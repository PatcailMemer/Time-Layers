"use strict"
const SPACE_ENERGY_UPGRADE_COST = [1,5,100,1000,1e5,1e10,1e15,1e25,1e50,1e100,1e200,"1e1000"]
const NUCLEO_UPGRADE_COST = [9e12,6e14,1e17,NaN]
const NORMAL_ENERGY_UPGRADE_COST = [1e8, 5, 100, 1000]

let canBuySEU = x => !game.SEU.includes(x) && game.spaceEnergy.gte(SPACE_ENERGY_UPGRADE_COST[x-1])

function buySEU(x) {
  if (canBuySEU(x)) {
    game.spaceEnergy = game.spaceEnergy.minus(SPACE_ENERGY_UPGRADE_COST[x-1])
    game.SEU.push(x)
  }
}

let canBuyNEU = x => !game.NEU.includes(x) && game.normalEnergy.gte(NORMAL_ENERGY_UPGRADE_COST[x-1])

function buyNEU(x) {
  if (canBuyNEU(x)) {
    game.normalEnergy=game.normalEnergy.minus(NORMAL_ENERGY_UPGRADE_COST[x-1])
    game.NEU.push(x)
  }
}

function getNucleoLength() {
  let neoTime = EN(1200)
  if (game.SEU.includes(3)) neoTime = neoTime.times(getSpaceEnergyTimeMult())
  if (hasSTF(37)) neoTime = neoTime.times(getTempCompBase())

  let neoLen = game.nucleoTime.max(120).min(neoTime).minus(120)

  if (game.SEU.includes(6)) neoLen = neoLen.pow(1.5)
  if (game.SEU.includes(10)) neoLen = neoLen.pow(2)
  neoTime = neoTime.div(1000)
  if (!game.PEU.includes(3)) neoLen = neoLen.minus(game.spentNucleo)
  return neoLen
}

function getSpaceEnergyTimeMult() {
  if (inGalChal(1,3)) return EN(1)
  let capped = game.spaceEnergy.min(2).add(1)
  if (game.SEU.includes(3)&&game.spaceEnergy.gte(3)) capped = EN(3).times(game.spaceEnergy.logBase(3).sqrt())
  if (game.SEU.includes(7)) capped = capped.times(3)
  if (game.SEU.includes(11)) capped = capped.times(3)
  return capped
}

function getSpaceEnergyRow1Mult() {
  if (inGalChal(3)) return EN(1)
  let capped = EN(1)
  if (game.SEU.includes(4) && game.spaceEnergy.gte(3)) capped = EN(1).times(game.spaceEnergy.logBase(3).sqrt())
  if (game.SEU.includes(8)) capped = capped.times(2)
  if (game.SEU.includes(12)) capped = capped.times(2)
  return capped
}

let canBuyNucleoUp = x => !game.nucleoUps.includes(x) && !(x === 2 && game.spacetimeComp.lt(7)) && getNucleoLength().gte(NUCLEO_UPGRADE_COST[x-1])

function buyNucleoUp(x) {
  if (canBuyNucleoUp(x)) {
    game.spentNucleo = game.spentNucleo.add(NUCLEO_UPGRADE_COST[x-1])
    game.nucleoUps.push(x)
    if (x === 2) game.spacetimeComp = game.spacetimeComp.minus(7)
  }
}

function getNucleoEffect(x) {
  switch(x) {
    case 1: return getNucleoLength().times(1000).add(1).log10().pow(2).div(300).add(1)
    case 2: return getNucleoLength().times(1000).add(1).pow(1/4)//.pow(game.galaxies[0].add(1))
    case 3: return 1 + (game.nucleoUps.includes(3) && game.galChal === 0 && !game.spaceless)
  }
}

function getNormalEnergyTimeMult() {
  let capped = game.normalEnergy.min(2).add(1)
  if (game.NEU.includes(3)&&game.normalEnergy.gte(3)) capped = EN(3).times(game.normalEnergy.logBase(3).sqrt())
  return capped
}

function getNormalEnergyRow2Mult() {
  let capped = EN(1)
  if (game.NEU.includes(4) && game.normalEnergy.gte(3)) capped = EN(1).times(game.normalEnergy.logBase(3).sqrt())
  return capped
}

function superNova(x) {
  if (game.starTypes.gte(1)) {
    if (game.bestStarTypes.gt(getSupernovaSum())) {
      let restAllow = game.bestStarTypes.minus(getSupernovaSum()).min(game.starTypes)
      game.starTypes = game.starTypes.minus(game.supernovaMode === 1 && game.achievement.includes(47) ? restAllow:1)
      game.supernova[x - 1] = game.supernova[x - 1].add(game.supernovaMode === 1 && game.achievement.includes(47) ? restAllow : 1)
    }
  }
}

function getSuperNovaEffect(x) {
  switch(x) {
    case 1:
      return EN(1).add(game.supernova[0].add(getSuperNovaEffect(4)).times(0.1))
    case 2:
      if (game.spaceless || (!game.achievement.includes(47) && (inGalChal(1,2,3)))) return EN(1)
      return EN(1e10).pow(game.supernova[1].add(getSuperNovaEffect(4)))
    case 3:
      return EN(2).add(game.galaxies[3]).pow(game.supernova[2].add(getSuperNovaEffect(4)))
    case 4:
      return game.supernova[3]
    default:
      return EN(1)
  }
}

let getSupernovaSum = () => game.supernova.reduce((a,b) => {return a.add(b)},EN(0))