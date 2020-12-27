function toggle(x) {
  game.toggle[x]=!game.toggle[x]
}

function onOff(x) {
  return game.toggle[x] ? "ON" : "OFF"
}

/*
document.getElementsByClassName("layerbutton")[2].addEventListener("click",x =>
  {window.scrollTo(0, document.getElementsByClassName("layerbutton")[2].getBoundingClientRect().top-50);}
)
*/