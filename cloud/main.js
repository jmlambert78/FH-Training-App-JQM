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
    collection.find({},{limit:3}).toArray(function(err, docs) {
      db.close();
    //$fh.log({"message":docs.length});  
    //console.log("in mongocall",docs.length);
	var response={data:{locations:docs}};
      if(err) 
        return cb(err)
      else
        return cb(null, response);
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
  $fh.log({"message":"in getpoints"});
  
  mongodbPoints(params, function(err, poi){
  data=poi;
  });
  
    // Build the response
  response = {'data': data,'cached':false};
   
  return response;
}

/**
 * Get stock symbol and detailed information by company name
 */
function getStockInfo(param) {
  return stock.getStockInfo(param.name);
}