/*
 Inserts an object (document) into a collection in MongoDB
 @param params.insert an object to insert into your database
 @param params.collection the collection to insert it into
 */
exports.mongodbPoints = function(params, cb){
  var MongoClient = require('mongodb').MongoClient,
          format = require('util').format,
          user = process.env.MONGODB_USER,
          password = process.env.MONGODB_PASSWORD,
          upString = (typeof user === 'string' && typeof password === 'string') ? user + ":" + password : "",
          database = process.env.MONGODB_DATABASE,
          host = process.env.MONGODB_HOST;

  MongoClient.connect('mongodb://' + upString + '@' + host + '/' + database, function(err, db) {
    if(err) return cb(err);

    var collection = db.collection("poi");
    collection.find(params[0], params[1],function(err, docs) {
      db.close();
    //$fh.log({"msg":,docs.length});  
    //console.log("in mongocall",docs.length);
      return cb(null, docs);
    });
  });

};


/*
 * Twitter
 */
function getTweets() {
  var username   = 'feedhenry';
  var num_tweets = 10;
  var url        = 'http://search.twitter.com/search.json?q=' + username;

  var response = $fh.web({
    url: url,
    method: 'GET',
    allowSelfSignedCert: true
  });
  return {'data': $fh.parse(response.body).results};
}

/*
 * Payment
 */ 
function payment() {
  var cardType   = $params.cardType;
  var cardNumber = $params.cardNumber;
  var url = "http://www.webservicex.net/CreditCard.asmx/ValidateCardNumber?cardType=" + cardType + "&cardNumber=" + cardNumber;

  return $fh.web({
    url: url,
    method: 'GET'
  });
}

/*
 * Maps
 */
// Cache points for 10 seconds
var CACHE_TIME = 30;
var MARKERS = {
  locations: [
    {
      lat: '48.74',
      lon: '2.30'
    },
    {
      lat: '48.9',
      lon: '2.30'
    },
    {
      lat: '48.6',
      lon: '2.20'
    },
    {
      lat: '48.5',
      lon: '2.25'
    }
  ]
};

function getCachedPoints() {
  var ret = $fh.cache({
    "act": "load",
    "key": "points"
  });
  return ret.val;
}

function cachePoints(hash, data) {
  var obj = {
    "hash": hash,
    "data": data,
    "cached": true
  };
  $fh.cache({
    "act": "save",
    "key": "points",
    "val": obj,
    "expire": CACHE_TIME
  });
}
// db content : db.poi.insert({
//    _id:1,
//    lon:48.4935,
//    lat:2.645,
//    desc:"POI# 1",
//    nfc:true,
//    detail:"POI# 1 details"});



function getPoints() {
  var response = {};
  var cache    = getCachedPoints();
  var poi = [],err;
  var params = ["{}","{lat:1,lon:1,_id:0}"];
  
  mongodbPoints(params, function(err, poi){
  //$fh.log({"msgout":,poi.length});
  data=poi;
  cache=null;
  });
  if (cache.length === 0) {
    var data = MARKERS;
    var hash = $fh.hash({
      algorithm: 'MD5',
      text: $fh.stringify(data)
    });

    // Cache the data
    cachePoints(hash, data);

    // Build the response
    response = {'data': data, 'hash':hash, 'cached':false};
  } else {
    // Parse the cached data
    cache = $fh.parse(cache);

    if( $params.hash && $params.hash === cache.hash ) {
      // Client data is up to date
      response = {'hash':$params.hash, 'cached':true};
    } else {
      // Hash value from client missing or incorrect, return cached cloud data
      response = cache;
    }
  }
  return response;
}

/**
 * Get stock symbol and detailed information by company name
 */
function getStockInfo(param) {
  return stock.getStockInfo(param.name);
}