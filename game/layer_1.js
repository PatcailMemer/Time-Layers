"use strict"

const SPACETIME_UPGRADE_COST = [[2,1.25,1.5,10,15,45,240,600,NaN],[2e6,20000,NaN,11,14,16,"e1050","e10500",NaN],[200,500,5000,10,20,NaN,NaN,NaN,NaN]]

function stinc(x,thing=false) {
  if (game.spaceless&&(!thing)&&x!==1&&x<=9) return false
  return game.spaceTimeFoamUpgrade.includes(x+"")
}

function getTempCompCost() {
  if (game.tempComp.gte(21)&&inGalChal(2)) {
    return EN(Infinity)
  }
  if (game.tempComp.gte(21)&&inGalChal(5)) {
    return EN(Infinity)
  }
  if (game.tempComp.gte(18)&&inGalChal(4)) {
    return EN(Infinity)
  }
  if (game.tempComp.gte(19)&&inGalChal(3)) {
    return EN(Infinity)
  }
  return EN(20).times(EN(1.5).pow(game.tempComp.pow(1.5))).div(1+2*stinc(13)).div(stinc(13)?getSpaceEnergyRow1Mult():1).div(stinc(14)?2.25*(game.SEU.includes(9)?10:1):1).times(inGalChal(4)?10:1)
}

function getSpaceCompCost(bulk=1) {
  return EN(0.2).times(EN(1.5).pow(game.spaceComp.add(bulk).minus(1).pow(1.5)))
    .div(EN(1+2*stinc(23)).times(stinc(23)?getSpaceEnergyRow1Mult():1))
    .div(stinc(14)?2.25*(game.SEU.includes(9)?10:1):1)
}


function getSpaceTimeRate() {
  return getTempCompEffect().times(game.spaceFoam).times(1+stinc(33)).times(stinc(13)?getSpaceEnergyRow1Mult():1)
    .times(game.achievement.includes(16)?10:1)
    .times(stinc(27)?1e50:1)
    .times(game.nucleoUps.includes(2)?getNucleoEffect(2):1)
    .times(getNucleoEffect(2).pow(game.galaxies[0].pow(getNucleoEffect(3))))
    .div(game.spaceless?1e60:1)
    .div(inGalChal(1)?1e50:1)
    .times(starMile(16)&&game.spaceless&&inGalChal(1)?1e55:1)
    .times(game.perspectivePower.max(1))
    .times(getSuperNovaEffect(2))
}

function getSpaceTimeCost() {
  return EN(20).times(EN(1.5).pow(EN(1.5).pow(game.spacetimeComp))).div(stinc(14)?2.25**2*(game.SEU.includes(9)?100:1):1)
  .div(game.achievement.includes(38)?"e999":1)
}

function buySpaceTimeComp() {
  if (game.spacetime.gte(getSpaceTimeCost())&&!inGalChal(5)) {
    game.spacetime=game.spacetime.minus(getSpaceTimeCost())
    game.spacetimeComp = game.spacetimeComp.add(1)
  }
}

function getSpacetimeCompEffect() {
  return game.spacetimeComp
    .times(stinc(22)?EN(1).add(EN(0.015).times(1+stinc(25)*(1+stinc(28))).times(game.spacetimeComp)):1)
    .times(game.achievement.includes(28)?1.19:1)
}

function caplog10(x) {
  return x.gte(10) ? x.log10().times(10) : x
}

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
  return getTempCompBase().pow(caplog10(game.tempComp).min(15).add(caplog10(getSpacetimeCompEffect())).add(inAnyGalChal()?0:game.superComp.temp))
}

function getTempCompBase() {
  return EN(1.1).add(stinc(12)?(stinc(15)?caplog10square(game.spaceComp):game.spaceComp.min(12)).times(0.015):0).add(game.achievement.includes(28)?0.19:0)
}

function caplog10square(x) {
  return x.lte(12) ? x : x.log10().pow(2).times(10)
}

function getSpaceCompEffect() {
  return getSpaceCompBase().pow(game.spaceComp.add(getSpacetimeCompEffect()))
}

function getSpaceCompBase() {
  if (inGalChal(2)) return getStarEffect().times(1.1)
  return EN(1.1)
    .add(stinc(32)?game.tempComp.times(0.015*(1+stinc(33))).times(stinc(33)?getSpaceEnergyRow1Mult():1):0)
    .add(game.achievement.includes(18)?0.09:0)
    .add(stinc(26)?game.spacetime.max(1).log10().div(100)
         .times(game.nucleoUps.includes(1)?getNucleoEffect(1):1)
         .times(getNormalEnergyRow2Mult())
         :0)
    .add(stinc(17)?game.spaceComp.times(0.03):0)
    .times(getStarEffect())
    .times(getSuperNovaEffect(1))
  
}

function canBuySpaceTimeUpgrade(x,y) {
  if (game.spaceTimeFoamUpgrade.includes(x+""+y)) return false
  let currency = ""
  switch(x) {
    case 1:
      currency="spaceFoam"
      break
    case 2:
      currency="spacetime"
      break
    case 3:
      currency="timeFoam"
      break
  }
  if (y>=4) {
    switch(x) {
      case 1:
        currency="spaceComp"
        break
      case 2:
        if (y<=6) currency="spacetimeComp"
        break
      case 3:
        currency="tempComp"
        break
    }
  }
  return game[currency].gte(SPACETIME_UPGRADE_COST[x-1][y-1])
}

function buySpaceTimeUpgrade(x,y) {
  if (canBuySpaceTimeUpgrade(x,y)) {
    let currency = ""
    switch(x) {
      case 1:
        currency="spaceFoam"
        break
      case 2:
        currency="spacetime"
        break
      case 3:
        currency="timeFoam"
        break
  }
  if (y>=4) {
  switch(x) {
    case 1:
      currency="spaceComp"
      break
    case 2:
      if (y<=6) currency="spacetimeComp"
      break
    case 3:
      currency="tempComp"
      break
    }
  }
  game[currency]=game[currency].minus(SPACETIME_UPGRADE_COST[x-1][y-1])
  game.spaceTimeFoamUpgrade.push(x+""+y)
  }
}