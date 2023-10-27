var date = new Date().toLocaleString().replace(/T/, ' ').replace(/\.\w*/, '');
var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
var tmx2 = new Date(Date.now() - tzoffset).toISOString().slice(0, -1).replace(/T/, ' ').replace(/\..+/, '')     // delete the dot and everything after;
console.log(date)
console.log(tmx2)