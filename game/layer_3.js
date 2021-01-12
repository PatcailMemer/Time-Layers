"use strict"
const TRIANGULAR_NUMBERS=[1,3,6,10,15,21,28]
let starMile = x => game.bestStarTypes.gte(x) || game.PEU.includes(1)&&TRIANGULAR_NUMBERS.includes(x)

let getStarEffect = () => EN(1)
    .add((game.achievement.includes(47)?game.bestStarTypes:game.starTypes).div(10).times(game.achievement.includes(48)?1.29:1))
    .pow(inGalChal(2)?2:EN(2).minus(EN(1).div(game.galaxies[1].add(1))))

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
    game.galChal=0
  }
}