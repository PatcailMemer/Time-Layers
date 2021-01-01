const PERCEPTION_UPGRADE_COST = [1e2, 1e3, 1e5, 1e7, 1e10, 1e15, 1e25, 1e50, 1e100]


function canBuyPEU(x) {
  return !game.PEU.includes(x) && game.perspectivePower.gte(PERCEPTION_UPGRADE_COST[x-1])
}

function buyPEU(x) {
  if (canBuyPEU(x)) {
    game.perspectivePower=game.perspectivePower.minus(PERCEPTION_UPGRADE_COST[x-1])
    game.PEU.push(x)
  }
}

function buySuperTempComp() {
  if (game.tempComp.gte(getSuperTempCompCost())) {
    game.superComp.temp=game.superComp.temp.add(1)
    reset(3)
  }
}

function getSuperTempCompCost() {
  return EN(20).times(EN(1.5).pow(game.superComp.temp.pow(1.5))).round()
}

function getPerspectiveRate() {
  return game.spaceComp.add(1).pow(game.perspectivePoint.minus(1))
    .times(getSuperNovaEffect(3))
    .times(game.normalEnergy.add(10).log10().pow(game.galaxies[4]))
    .times(game.PEU.includes(9)?1e10:1)
}
