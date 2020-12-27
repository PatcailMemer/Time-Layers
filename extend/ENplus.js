const isExpantaNum = /^[-\+]*(Infinity|NaN|(J+|J\^\d+ )?(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/

ExpantaNum.prototype.toHyperE = function() {
  if(this.layer == -1) {
    if (this.sign==-1) return "-"+this.abs().toHyperE();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    if (this.lt(ExpantaNum.MAX_SAFE_INTEGER)) return String(this.array[0][1]);
    if (this.lt(ExpantaNum.E_MAX_SAFE_INTEGER)) return "E"+this.array[0][1];
    var r="E"+this.array[0][1]+"#"+this.array[1][1];
    for (var i=2;i<this.array.length;i++){
      r+="#"+(this.array[i][1]+1);
    }
    return r; 
  }
  let a = this.clone()
  a.layer = -1
  console.log(a)
  return "E"+a.toHyperE()+"##"+(this.layer+1)
}

ExpantaNum.prototype.beautify = function(f=0) {
  let thing = this
  if (!thing.isFinite()) {
    return "Infinity"
  }
  if (thing.eq(0) || thing.gte(0.001) || f != Infinity) {
  if (thing.lt(1e3)) {
    return thing.toNumber().toFixed(Math.min(f,6))
  }
  if (thing.lt(1e6)) {
    let digits = thing.floor().toString().split("")
    digits.splice(digits.length-3, 0, ",")
    return digits.join("")
  }
  }
  let exponent=thing.log10().floor()
  let mantissa = thing.div(EN(10).pow(exponent)).toNumber().toFixed(3)
  if (mantissa=="10.000") mantissa="9.999"
  return mantissa+"e"+exponent
}

ExpantaNum.prototype.toTime = function() {
  let time = this
  if (time.lt(60)) {
    return time.beautify(2) + "s"
  }
  let min = time.div(60).floor()
  time = time.mod(60)
  if (min.lt(60)) {
    return min.beautify() + "m " + time.beautify(2) + "s"
  }
  let hour = min.div(60).floor()
  min = min.mod(60)
  if (hour.lt(24)) {
    return hour.beautify() + "h " + min.beautify() + "m " + time.beautify(2) + "s"
  }
  let day=hour.div(24).floor()
  hour=hour.mod(24)
  if (day.lt(365)) {
    return day.beautify() + "d " + hour.beautify() + "h " + min.beautify() + "m"
  }
  let year = day.div(365).floor()
  day=day.mod(365)
  if (year.lt(10)) {
    return year.beautify() + "y " + day.beautify() + "d " + hour.beautify() + "h"
  }
  if (year.lt(1000)) {
    return year.beautify() + "y " + day.beautify() + "d"
  }
  return year.beautify() + " years"
}