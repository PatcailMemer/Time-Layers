function notify(text) {
  let elem = document.createElement("div")
  elem.style["border-radius"] = "10px";
  elem.style["border-style"] = "solid";
  elem.className = "notification"
  elem.innerHTML = text
  document.getElementById("notifs").appendChild(elem)
  setTimeout(()=>elem.remove(),5000)
}

