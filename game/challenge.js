function inGalChal(x) {
  if (x==game.galChal) {
    return true
  }
  return false
}

function inAnyGalChal() {
  if (0!=game.galChal) {
    return true
  }
  return false
}

function enterGalChal(x) {
  if (!inAnyGalChal()) {
    reset(2)
    game.galChal=x
  }
}

function exitGalChal() {
  if (inAnyGalChal()) {
    reset(2)
    game.galChal=0
  }
}