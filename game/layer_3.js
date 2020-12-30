"use strict"

const TRIANGULAR_NUMBERS=[1,3,6,10,15,21,28]

function starMile(x) {
  return game.bestStarTypes.gte(x) || game.PEU.includes(1)&&TRIANGULAR_NUMBERS.includes(x) //checkTriangle(x)
}

// the below function could be used to dynamically calculate if x is triangular, 
//but the above function is called wayyyy too much for it to be efficient. -Anthios
/* 
function checkTriangle(x) {
  if (x <= 0 || typeOf(x) !== "number") return false
  let i = 0, j = 0
  while (j <= x) {
    i++
    j += i
    if (j === x) return true
  }
  return false
}
*/

function getStarEffect() {
  return EN(1)
    .add((game.achievement.includes(47)?game.bestStarTypes:game.starTypes).div(10).times(game.achievement.includes(48)?1.29:1))
    .pow(inGalChal(2)?2:EN(2).minus(EN(1).div(game.galaxies[1].add(1))))
}