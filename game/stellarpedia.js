const stellarpedia = [
  [
    "Keep the entire first row and the first Space Energy",
    "Keep the first Row 2 upgrade and the second Space Energy",
    "Keep the third Space Energy",
    "Keep the second Row 2 upgrade and the fourth Space Energy",
    "Keep the fifth Space Energy",
    "Keep the third Row 2 upgrade and the sixth Space Energy",
    "Keep the seventh Space Energy",
    "Keep the eigth Space Energy",
  ],
  [
    "Keep the ninth Space Energy",
    "Keep the tenth Space Energy",
    "Keep the eleventh Space Energy",
    "Keep the twelfth Space Energy",
    "",
    "",
    "Unlock Galaxies",
    "If you're in both Spaceless and in Galaxy 1, square root all Spacetime dividers",
  ],
  [
    "",
    "",
    "",
    "Unlock Galaxy II",
    "",
    "",
    "",
    "Unlock Galaxy III",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Unlock Galaxy IV",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Unlock Galaxy V - Not Implemented",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Unlock Galaxy VI - Not Implemented",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Unlock Galaxy VII - Not Implemented",
  ]
]

function toRoman(x) { //tf is this
  let counter = Math.min(x,80)
  let running = ""
  if (counter>=50) {
    counter -= 50
    running += "L"
  }
  if (counter>=40) {
    counter -= 40
    running += "XL"
  }
  while (counter >= 10) {
    counter -= 10
    running += "X"
  }
  running += ["","I","II","III","IV","V","VI","VII","VIII","IX"][counter]
  return running
}