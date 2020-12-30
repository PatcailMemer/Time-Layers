"use strict"

const YEAR_IN_SECONDS = 365*24*60*60

let canSave = false
document.body.addEventListener("click",() => {canSave=true})

const get = x => document.getElementById(x)
let game 
let app
game = newGame()
app = newVue() // no data yet
app.$data.tab = 1
load(JSON.parse(localStorage.getItem("timeLayerSave")))

window.setInterval(function() {
  let now=Date.now()
  loop(now-game.lastTick)
  game.lastTick=now
}, 50)

window.setInterval(function() {
  if (canSave) save()
}, 10000)

function loop(ms) {
  let s = EN(ms/1000)
  let overallSpeed = EN(1)
  app.$data.game = game
  
  game.timeInL3R = game.timeInL3R.add(s)
  if (game.perspectivePoint.gte(1)) game.perspectivePower = game.perspectivePower.add(getPerspectiveRate().times(s))
  
  game.bestStarTypes = game.bestStarTypes.max(game.starTypes)
  
  if (game.highestReset>=3) {
    [11,21,31,14,24,34,17,27,37].forEach(i => {
      if (!stinc(i,true)) game.spaceTimeFoamUpgrade.push((i).toString())
    })
  }
  
  if (game.highestReset>=2) {
    for (let i=0;i<12;i++) {
      if (starMile(i+1) && !game.SEU.includes(i+1)) game.SEU.push(i+1)
    }
  }
  
  if (starMile(2)) {
    if (!stinc(14,true)) game.spaceTimeFoamUpgrade.push("14")
    if (!stinc(24,true)) game.spaceTimeFoamUpgrade.push("24")
    if (!stinc(34,true)) game.spaceTimeFoamUpgrade.push("34")
  }
  
  if (starMile(4)) {
    if (!stinc(15,true)) game.spaceTimeFoamUpgrade.push("15")
    if (!stinc(25,true)) game.spaceTimeFoamUpgrade.push("25")
    if (!stinc(35,true)) game.spaceTimeFoamUpgrade.push("35")
  }
  
  if (starMile(6)) {
    if (!stinc(16,true)) game.spaceTimeFoamUpgrade.push("16")
    if (!stinc(26,true)) game.spaceTimeFoamUpgrade.push("26")
    if (!stinc(36,true)) game.spaceTimeFoamUpgrade.push("36")
  }
  
  app.$data.timeLayerSpeed[2]=overallSpeed.beautify(2)
  overallSpeed=overallSpeed.times(inGalChal(3)?2:1).times(inGalChal(5)?1:1)
  app.$data.timeLayerMult[2]=EN(inGalChal(3)?2:1).times(inGalChal(5)?1:1).beautify(2)
  s = EN(ms/1000).times(overallSpeed)
  
  
  if (stinc(36)) game.spaceEnergy=game.spaceEnergy.add(getPrestige(1).times(getNormalEnergyRow2Mult()).times(s))
  
  if (game.SEU.includes(5)||game.highestReset>=2) {
    let spaceMax = EN(Infinity)
    if (isExpantaNum.test(game.autoComp.space)&&EN(game.autoComp.space).neq(-1)) {
      spaceMax=EN(game.autoComp.space)
    }
    let timeMax = EN(Infinity)
    if (isExpantaNum.test(game.autoComp.temp)&&EN(game.autoComp.temp).neq(-1)) {
      timeMax=EN(game.autoComp.temp)
    }
    let spaceTimeMax = EN(Infinity)
    if (isExpantaNum.test(game.autoComp.spacetime)&&EN(game.autoComp.spacetime).neq(-1)) {
      spaceTimeMax=EN(game.autoComp.spacetime)
    }
    if (game.tempComp.lt(timeMax)) buyTempComp()
    if (game.spacetimeComp.lt(spaceTimeMax)) buySpaceTimeComp()
    if (game.spaceComp.add(1).lte(spaceMax)) buySpaceComp()
    if (game.spaceComp.add(20).lte(spaceMax)) buySpaceComp(20)
    if (game.spaceComp.add(100).lte(spaceMax)) buySpaceComp(100)
  }
  
  if (game.spaceEnergy.gte(1)||starMile(1)) {
    if (!stinc(11,true)) game.spaceTimeFoamUpgrade.push("11")
    if (!stinc(21,true)) game.spaceTimeFoamUpgrade.push("21")
    if (!stinc(31,true)) game.spaceTimeFoamUpgrade.push("31")
  }
  
  if (game.spaceEnergy.gte(2)||starMile(1)) {
    if (!stinc(12,true)) game.spaceTimeFoamUpgrade.push("12")
    if (!stinc(22,true)) game.spaceTimeFoamUpgrade.push("22")
    if (!stinc(32,true)) game.spaceTimeFoamUpgrade.push("32")
  }
  
  if (game.spaceEnergy.gte(3)||starMile(1)) {
    if (!stinc(13,true)) game.spaceTimeFoamUpgrade.push("13")
    if (!stinc(23,true)) game.spaceTimeFoamUpgrade.push("23")
    if (!stinc(33,true)) game.spaceTimeFoamUpgrade.push("33")
  }
  
  for (let i in app.$data.row4PEU) {
    let ii = Number(i)+1
    if (game.PEU.includes(ii)) app.$data.row4PEU[i]="upgradeButton bought"
    else if (canBuyPEU(ii)) app.$data.row4PEU[i]="upgradeButton layer4"
    else app.$data.row4PEU[i]="upgradeButton locked"
  }
  
  for (let i in app.$data.row2NEU) {
    let ii = Number(i)+1
    if (game.NEU.includes(ii)) app.$data.row2NEU[i]="upgradeButton bought"
    else if (canBuyNEU(ii)) app.$data.row2NEU[i]="upgradeButton layer2"
    else app.$data.row2NEU[i]="upgradeButton locked"
    
  }
  
  
  for (let i in app.$data.row2SEU) {
      let ii = Number(i)+1
      if (game.SEU.includes(ii)) app.$data.row2SEU[i]="upgradeButton bought"
      else if (canBuySEU(ii)) {
        if (game.PEU.includes(3)) buySEU(ii)
        app.$data.row2SEU[i]="upgradeButton layer2"
      } else {
        app.$data.row2SEU[i]="upgradeButton locked"
      }
  }
  
  app.$data.timeLayerSpeed[1]=overallSpeed.beautify(2)
  overallSpeed=overallSpeed.times(getSpaceEnergyTimeMult().times(getNormalEnergyTimeMult()))
  app.$data.timeLayerMult[1]=getSpaceEnergyTimeMult().times(getNormalEnergyTimeMult()).beautify(2)
  s = EN(ms/1000).times(overallSpeed)
  
  if (game.highestReset>=1&&game.SEU.includes(1)) {
    game.nucleoTime=game.nucleoTime.add(s.times(1+game.SEU.includes(6)).times(1+game.SEU.includes(10)))
  }
  
  for (let i in app.$data.nucleoUp) {
      let ii = Number(i)+1
      if (game.nucleoUps.includes(ii)) {
        app.$data.nucleoUp[i]="upgradeButton bought"
      } else if (canBuyNucleoUp(ii)) {
        if (game.PEU.includes(3)) {
          buyNucleoUp(ii)
        }
        app.$data.nucleoUp[i]="upgradeButton layer3"
      } else {
        app.$data.nucleoUp[i]="upgradeButton locked"
      }
  }
  
  
  
  game.timeFoam = game.timeFoam.add(s.times(getTempCompEffect()))
  app.$data.tempCompCost = getTempCompCost().beautify(2)
  app.$data.tempCompEffect = getTempCompEffect().beautify(2)
  app.$data.timeFoamSpeed=getTempCompEffect().beautify(2)
  
  for (let i in app.$data.row1SpaceTimeUpgrade) {
    for (let j in app.$data.row1SpaceTimeUpgrade[i]) {
      let ii = Number(i)+1
      let jj = Number(j)+1
      if (game.spaceTimeFoamUpgrade.includes((ii)+""+(jj))) {
        app.$data.row1SpaceTimeUpgrade[i][j]="upgradeButton bought"
      } else if (canBuySpaceTimeUpgrade(ii,jj)) {
        app.$data.row1SpaceTimeUpgrade[i][j]="upgradeButton layer1"
      } else {
        app.$data.row1SpaceTimeUpgrade[i][j]="upgradeButton locked"
      }
    }
  }
  
  if (game.spaceless) {
    game.spaceFoam=EN(1)
  } else {
    game.spaceFoam=game.spaceFoam.max(
      EN(1).add(getNucleoLength())
      .times(getSpaceCompEffect())
      .times(stinc(24)&&(!inGalChal(2))?game.spaceEnergy.max(1):1)
      .times(stinc(16)?game.timeFoam.sqrt().pow(getNormalEnergyRow2Mult()).max(1):1)
    ).min(inGalChal(4)?game.normalEnergy:Infinity)
  }
  
  app.$data.spaceCompCost = getSpaceCompCost().beautify(2)
  app.$data.spaceCompEffect = getSpaceCompEffect().beautify(2)
  
  app.$data.spaceCompBase=getSpaceCompBase().minus(1).times(100).beautify(0)
  app.$data.timeCompBase=getTempCompBase().minus(1).times(100).beautify(0)
  
  app.$data.spacetime.rate=getSpaceTimeRate()
  app.$data.spacetime.cost=getSpaceTimeCost().beautify(2)
  app.$data.spacetime.effect=getSpacetimeCompEffect()
  
  if (stinc(11)) {
    game.spacetime = game.spacetime.add(getSpaceTimeRate().times(s))
  }
  
  app.$data.timeLayerSpeed[0]=overallSpeed.beautify(2)
  overallSpeed=overallSpeed.times(getTempCompEffect())
  app.$data.timeLayerMult[0]=getTempCompEffect().beautify(2)
  s = EN(ms/1000).times(overallSpeed)
  
  game.universeAge = game.universeAge.add(s)
  
  
  app.$data.universeAge = game.universeAge.toTime()
  app.$data.overallSpeed = overallSpeed
  
  if (game.galChal!=0&&canPrestige(2)) {
    game.galaxies[game.galChal-1]=game.galaxies[game.galChal-1].add(1)
  }
  
  checkAchieve()
  if (app.$data.move !== 0) {
    if (app.$data.layertab === 0 || !game.toggle.autoscroll) {
      app.$data.move = 0
    } else {
      window.scrollTo(0, document.getElementsByClassName("layerbutton")[app.$data.move-1].getBoundingClientRect().top-50);
      app.$data.move = 0
    }
  }
}

