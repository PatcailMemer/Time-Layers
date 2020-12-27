"use strict"

const TRIANGULAR_NUMBERS=[1,3,6,10,15,21,28]

function starMile(x) {
  if (game.bestStarTypes.gte(x)) {
    return true
  }
  if (game.PEU.includes(1)&&TRIANGULAR_NUMBERS.includes(x)) {
    return true
  }
  return false
}

function getStarEffect() {
  return EN(1)
    .add((game.achievement.includes(47)?game.bestStarTypes:game.starTypes).div(10).times(game.achievement.includes(48)?1.29:1))
    .pow(inGalChal(2)?2:EN(2).minus(EN(1).div(game.galaxies[1].add(1))))
}