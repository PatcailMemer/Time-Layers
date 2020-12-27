"use strict"

function newGame() {
  return {
    lastTick: Date.now(),
    universeAge: EN(0),
    spaceFoam: EN(1),
    timeFoam: EN(0),
    tempComp: EN(0),
    spaceTimeFoamUpgrade: [],
    spaceComp: EN(0),
    spacetime: EN(0),
    spacetimeComp: EN(0),
    stinc: stinc,
    spaceEnergy: EN(0),
    highestReset: 0,
    SEU: [],
    nucleoTime: EN(0),
    achievement: [],
    starTypes: EN(0),
    nucleoUps: [],
    spentNucleo: EN(0),
    normalEnergy: EN(0),
    spaceless: false,
    galaxies: [EN(0),EN(0),EN(0),EN(0),EN(0),EN(0),EN(0),EN(0)],
    galChal: 0,
    NEU: [],
    timeInL3R: EN(0),
    perspectivePoint: EN(0),
    perspectivePower: EN(0),
    PEU: [],
    supernova: [EN(0),EN(0),EN(0),EN(0)],
    bestStarTypes: EN(0),
    superComp: {
      temp: EN(0),
      space: EN(0),
      spacetime: EN(0)
    },
    autoComp: {
      space: "0",
      temp: "0",
      spacetime: "0"
    },
    toggle: {
      resetSupernova: true,
      easterEgg: "wqRMXasndx",
      layerDisplay: true,
      autoscroll: false
    },
    supernovaMode: 0
  }
}
