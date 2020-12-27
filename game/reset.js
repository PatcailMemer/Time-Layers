"use strict"

function reset(layer) {
  let blankSave = newGame()
  let resetList = []
  switch(layer) {
      case 1:
        if (game.spaceless) {
          game.normalEnergy=game.normalEnergy.add(getPrestige(1)).min(game.galaxies[0].add(1).add(game.perspectivePower.floor()))
        } else {
          game.spaceEnergy=game.spaceEnergy.add(getPrestige(1))
        }
        game.highestReset=Math.max(game.highestReset,1)
        resetList = ["spaceFoam","timeFoam","tempComp","spaceComp","spacetime","spacetimeComp"]
        if (!game.SEU.includes(2)) {
          resetList.push("spaceTimeFoamUpgrade")
        }
        if (!(game.PEU.includes(3)&&game.PEU.includes(4))) {
          resetList.push("nucleoTime")
          resetList.push("nucleoUps")
          resetList.push("spentNucleo")
        }
        for (let i in resetList) {
          game[resetList[i]]=blankSave[resetList[i]]
        }
        break
      case 2:
        if (canPrestige(2)) {
          if (inAnyGalChal()) {
            game.galaxies[game.galChal-1]=game.galaxies[game.galChal-1].add(1)
          } else {
            if (game.PEU.includes(2)) {
              game.starTypes=getStarGain(app.$data.overallSpeed.div(YEAR_IN_SECONDS))
            } else {
            game.starTypes=game.starTypes.add(1)
            }
          }
        }
        game.starTypes=game.starTypes.max(game.bestStarTypes)
        game.highestReset=Math.max(game.highestReset,2)
        resetList=["spaceFoam","timeFoam","tempComp","spaceComp","spacetime","spacetimeComp",
                   "spaceEnergy","SEU","spaceless","normalEnergy"]
        if (game.toggle.resetSupernova||!game.achievement.includes(47)) {
          resetList.push("supernova")
        }
        if (!game.PEU.includes(5)) {
          resetList.push("spaceTimeFoamUpgrade")
        }
        if (!(game.PEU.includes(3)&&game.PEU.includes(4))) {
          resetList.push("nucleoTime")
          resetList.push("nucleoUps")
          resetList.push("spentNucleo")
          resetList.push("NEU")
        }
        for (let i in resetList) {
          game[resetList[i]]=blankSave[resetList[i]]
        }
        break
    case 3:
        if (canPrestige(3)) {
          game.perspectivePoint=game.perspectivePoint.add(1)
        }
        game.highestReset=Math.max(game.highestReset,3)
        resetList=["spaceFoam","timeFoam","tempComp","spaceComp","spacetime","spacetimeComp","nucleoTime",
                   "spaceEnergy","SEU","nucleoUps","spentNucleo","spaceless","normalEnergy","supernova","timeInL3R", "galChal"]
        if (!game.PEU.includes(5)) {
          resetList.push("spaceTimeFoamUpgrade")
        }
        if (!game.PEU.includes(4)) {
          resetList.push("NEU")
        }
        if (!game.PEU.includes(6)) {
          resetList.push("bestStarTypes")
          resetList.push("starTypes")
        } else {
          game.starTypes=game.bestStarTypes
        }
        if (!game.PEU.includes(7)) {
          resetList.push("galaxies")
        }
        if (!(game.superComp.temp.gte(1)||game.achievement.includes(46))) {
          resetList.push("perspectivePower")
        }
        for (let i in resetList) {
          game[resetList[i]]=blankSave[resetList[i]]
        }
      break
      case Infinity:
        game=newGame()
        break
      default:
        break
  }
} 

function getPrestige(layer) {
  if (!canPrestige(layer)) {
    return EN(0)
  }
  switch (layer) {
    case 1:
      if (inGalChal(2)&&game.spaceless) {
        return EN(0)
      }
      if (inGalChal(5)&&game.spaceless) {
        return EN(0)
      }
      if (inGalChal(3)) {
        return EN(0)
      }
      if (game.spaceless) {
        return game.spacetime.pow(1/6).div(10).times(1+game.achievement.includes(47)).floor()
      }
      return game.spacetime.pow(EN(game.SEU.includes(5)?1/5:1/6).add(game.galaxies[2].div(100))).div(10)
        .times(stinc(34)?Math.min(Math.max(game.spaceTimeFoamUpgrade.length-9,1),9):1)
        .times(game.spaceComp.gte(13)&&stinc(15)?game.spaceComp.minus(12).pow(stinc(18)?getSpacetimeCompEffect():1):1)
        .times(game.achievement.includes(26)?getNucleoLength().add(1):1)
        .times(game.perspectivePower.pow(5).max(1))
        .floor()
      break
    case 2:
      return getStarGain(app.$data.overallSpeed.div(YEAR_IN_SECONDS)).max(game.bestStarTypes)
      break
    case 3:
      return 1
    default:
      return EN(0)
      break
  }
}

const canPrestige = function(layer) {
  switch (layer) {
    case 1:
      return game.spacetime.gte(1e6)
      break
    case 2:
      let starLevel = game.starTypes
      if (inAnyGalChal()) {
        starLevel = game.galaxies[game.galChal-1]
      }
      return app.$data.overallSpeed.div(YEAR_IN_SECONDS).gte(getStarTypeCost(starLevel))
      break
    case 3:
      return game.starTypes.gte([16,20,24,26,28,30,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48][game.perspectivePoint.toNumber()])
    default:
      return false
      break
  }
}

function getStarTypeCost(x) {
  if (x.lte(5)) {
    return EN([1000,1500,2000,3000,5000,10000][x.toNumber()])
  } else {
    return EN(10000).times(EN(2).pow(x.minus(5)))
  }
}

function getStarGain(x) {
  if (x.lt(1000)) {
    return EN(0)
  }
  if (x.lt(1500)) {
    return EN(1)
  }
  if (x.lt(2000)) {
    return EN(2)
  }
  if (x.lt(3000)) {
    return EN(3)
  }
  if (x.lt(5000)) {
    return EN(4)
  }
  return x.div(5000).logBase(2).add(5).floor()
}