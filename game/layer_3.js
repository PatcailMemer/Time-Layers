"use strict"
const TRIANGULAR_NUMBERS=[1,3,6,10,15,21,28]
let starMile = x => game.bestStarTypes.gte(x) || game.PEU.includes(1)&&TRIANGULAR_NUMBERS.includes(x)

function getStarEffect() {
  let stellarBase = EN(1)
  if (game.achievement.includes(47)) stellarBase = game.bestStarTypes
  else stellarBase = game.StarTypes
  stellarBase = stellarBase.div(10)
  if (game.achievement.includes(48)) stellarBase = stellarBase.times(1.29)
  stellarBase = stellarBase.add(1)

  let stellarPow = EN(1)
  if (inGalChal(2)) stellarPow = 2
  else stellarPow = EN(2).minus(EN(1).div(game.galaxies[1].add(1)))

  return stellarBase.pow(stellarPow)
}

//Challenge
let inGalChal = x => x === game.galChal

let inAnyGalChal = () => 0 !== game.galChal

let enterGalChal = x => {
  if (!inAnyGalChal()) {
    reset(2)
    game.galChal = x
  }
}
let exitGalChal = () => {
  if (inAnyGalChal()) {
    reset(2)
    game.galChal = 0
  }
}