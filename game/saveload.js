"use strict"

function save() {
  localStorage.setItem('timeLayerSave', JSON.stringify(game))
}

function load(saveData) {
  if (typeof saveData != "undefined") {
    game=newGame()
    for (let thing in saveData) {
      if (thing=="toggle") {
        for (let pog in saveData[thing]) {
          game[thing][pog]=saveData[thing][pog]
        }
      } else {
        game[thing]=saveData[thing]
      }
    }
    
    game=ENnuke(game)
     // fixed? i think?
  } //Yes, I copy and pasted it from OM code lol
}// well now it works i guess poggers now time to clear my save data

function ENnuke(x) {
  let saveCounter
  let temp = x
  for (saveCounter in x) {
    if ((typeof temp[saveCounter] == "object")&&(typeof temp[saveCounter].array != "undefined")&&(typeof temp[saveCounter].sign != "undefined")&&(typeof temp[saveCounter].layer != "undefined")) {
        temp[saveCounter]=ENify(x[saveCounter])
    } else if (typeof temp[saveCounter] == "object") temp[saveCounter] = ENnuke(temp[saveCounter])
  }
  return temp
}

function ENify(x) {
  let newEN = new EN(0)
  newEN.array = x.array
  newEN.sign = x.sign
  newEN.layer = x.layer
  return newEN
}

function copyStringToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  copyToClipboard(el);
  document.body.removeChild(el);
  $.notify("Copied to clipboard","success")
}

function copyToClipboard(el) {
  el = typeof el === "string" ? document.querySelector(el) : el;
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    var editable = el.contentEditable;
    var readOnly = el.readOnly;
    el.contentEditable = true;
    el.readOnly = true;
    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);
    el.contentEditable = editable;
    el.readOnly = readOnly;
  } else {
    el.select();
  }
  document.execCommand("copy");
}