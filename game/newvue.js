"use strict"

function newVue() {
  return new Vue({
    el: "#app",
    data: {
      EN: EN,
      tab: 1,
      layertab: 1,
      layersubtab: [1,1,1,1,1,1,1,1,1,1],
      game: {},
      tempCompCost: "strangers",
      tempCompEffect: "love",
      timeFoamSpeed: "you",
      overallSpeed: EN(1),
      timeLayerMult: [1,1,1,1,1,1,1,1,1,1],
      timeLayerSpeed: [1,1,1,1,1,1,1,1,1,1],
      row1SpaceTimeUpgrade: [["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""]],
      spaceCompCost: 0,
      spaceCompEffect: 0,
      spaceCompBase: 0,
      timeCompBase: 0,
      showSpaceTime: false,
      spacetime: {
        rate: 0,
        cost: 0,
        effect: 0,
      },
      getPrestige: getPrestige,
      canPrestige: canPrestige,
      row2SEU: ["","","","","","","","","","","","","","","",""],
      achieveData: achieveData,
      zeroSeven: [0,1,2,3,4,5,6,7],
      spaceEnergyTimeMult: getSpaceEnergyTimeMult,
      normalEnergyTimeMult: getNormalEnergyTimeMult,
      nucleoLength: getNucleoLength,
      spaceEnergyRow1Mult: getSpaceEnergyRow1Mult,
      normalEnergyRow2Mult: getNormalEnergyRow2Mult,
      nucleoUp: ["","","",""],
      getNucleoEffect: getNucleoEffect,
      getStarTypeCost: getStarTypeCost,
      row2NEU: ["","","",""],
      getTempCompBase: getTempCompBase,
      starMile: starMile,
      row4PEU: ["","","","","","","","","","","","","","","",""],
      getSpacetimeCompEffect: getSpacetimeCompEffect,
      getSuperNovaEffect: getSuperNovaEffect,
      row4Supercomp: [["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""]],
      superComp: {
        tempCost: getSuperTempCompCost
      },
      inGalChal() {return 0 !== game.galChal},
      getPerspectiveRate: getPerspectiveRate,
      PERSPECTIVE_REQ: [16,20,24,26,28,30,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],
      getStarEffect: getStarEffect,
      toRoman: toRoman,
      stellarpedia: stellarpedia,
      onOff(x) {return game.toggle[x] ? "ON" : "OFF"},
      move: 0
    }
  })
}