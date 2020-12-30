function inGalChal(x) {
  return x === game.galChal
}

function inAnyGalChal() {
  return 0 !== game.galChal
}

function enterGalChal(x) {
  if (!inAnyGalChal()) {
    reset(2)
    game.galChal = x
  }
}

function exitGalChal() {
  if (inAnyGalChal()) {
    reset(2)
    game.galChal=0
  }
}