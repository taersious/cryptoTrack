var express = require('express');
var router = express.Router();

// https://medium.com/@nima.2004hkh/create-your-first-login-page-with-exprerssjs-pug-f42250229486

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(' ');
  var datetime = new Date();
  var btc = req.query.BTC == undefined ? '' : CleanQuerystring(req.query.BTC);
  var profit = req.query.PROFIT == undefined ? '' : CleanQuerystring(req.query.PROFIT);
  var unpaid = req.query.UNPAID == undefined ? '' : CleanQuerystring(req.query.UNPAID);
  var payout = req.query.NEXTPAYOUT == undefined ? '' : CleanQuerystring(req.query.NEXTPAYOUT);
  var wallet = req.query.WALLET == undefined ? '' : CleanQuerystring(req.query.WALLET);
    
  if(btc == "")
  {
    var dup = '';
    var dpm = '';
    var dph = '';
    var dollars = '';
    var btcMin = '';
    var nextPayoutDollars = '';
    var countDown = '';
  }
  else {
    btc = CleanInput(btc);
    var dup = DaysUntilPayout(wallet,profit);
    dup = FloatPrecision(dup,5);
    var dpm = DollarsPerMinute(profit,btc);
    dpm = FloatPrecision(dpm,5);
    var dph = FloatPrecision(dpm*60,5);
    var dollars = FloatPrecision(btc*wallet,2);
    var nextPayoutDollars = NextPayoutDollars(payout, btc, unpaid, dpm);
    var countDown = ParseDays(dup);
    btcMin = FloatPrecision(unpaid / (240-payout),10);
  }

  var results  = {
    "btc": btc,
    "profit": profit,
    "unpaid": unpaid,
    "payout": payout,
    "wallet": wallet,
    "payoutDays": dup,
    "btcPerMinute": btcMin,
    "dollarsPerMinute": dpm,
    "dollarsPerHour": dph,
    "dollars": dollars,
    "nextPayoutDollars": nextPayoutDollars,
    "countDown": countDown
  };

  console.log('logging: ' + JSON.stringify(results));

  res.locals.data = JSON.stringify(results);
  res.render('index', { error: false , title: 'cryptoTrack', 
    currenttime: datetime });
});

module.exports = router;

var CleanQuerystring = function(input) {
  var retVal = input.toString().trim();
  return input.replace(/[ BTC]/g, "");
}

var CleanInput = function(input) {
  var retVal = input;
  if((input.indexOf('$') >= 0) || (input.indexOf(',') >= 0) )
  {
    //console.log("$ " + input);
    retVal = input.replace(/[$,]/g, "");
  }
  if(input.indexOf('%') >=0)
  {
    //console.log("% " + input);
    retVal = unescape(input);
  }
  //console.log(retVal);
  return retVal;
};

var DaysUntilPayout = function(balance,profit) {
  var x = parseFloat((.001 - balance) / profit);
  //console.log('days ' + x);
  if (x <= 0.0) { x=0; }
  return x;
}

var DollarsPerMinute = function(profit, btc) {
  var x = parseFloat(profit / 24 / 60 * btc);
  return x;
}

var StripTrailingZero = function(input) {
  var x = input.toString();
  var size = x.length;
  while(x.charAt(size-1) == "0")
  {
    x = s.substring(0,--size);
    //console.log(size);
  }
  return x;
}

var ParseDays = function(dup) {
  var days = parseInt(dup);
  var hours = parseInt((dup - days)*24);
  var minutes = parseInt((((dup - days)*24)-hours)*60);
  return "Payout in " + days + " days " + hours + " hours " + minutes + " minutes ";
}

var NextPayoutDollars = function(payout, btc, unpaid, dpm) {
  var pending = parseFloat(btc * unpaid);
  //console.log("pending: " + pending);
  if(payout <= 0.0 ) {payout = 1; }
  var next = parseFloat(payout * dpm);
  //console.log("next: " + next);
  return FloatPrecision(pending + next, 5);
}

var FloatPrecision = function(input, size) {
  return parseFloat(input).toFixed(size);
}