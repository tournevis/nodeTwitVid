var twit = require('twit');
var fs = require('fs');
var https = require('https');
 var osc = require('node-osc');

var client = new osc.Client('127.0.0.1', 7000);
var T = new twit({
    consumer_key:         'PyED5K5Adbx87i8us5yMAVcDv'
  , consumer_secret:      'PBfEhhCLkGlPkwETrL3U64K2j1jHXFg8lezbF5ZjivN4uqsIAX'
  , access_token:         '471885262-q8HBKtfka1LWJ4HcrVP4F4mcPs4xWEPugeQ5hC3n'
  , access_token_secret:  'wCX1qgei92tUoDEbcdGhTAsGXSEp1IjlpR8TM8ZHmRIHI'
});

console.log("stream'in baby");
var filter = '#vidTest198'
var stream = T.stream('statuses/filter', { track: filter });
 var client = new osc.Client('127.0.0.1', 7000);
/*var file = fs.createWriteStream("vid.jpg");
var request = http.get("https://pbs.twimg.com/media/CGsmG-3XIAAWyAi.jpg", function(response){
	response.pipe(file);
});*/
var videoCounter = 0 ;

var download = function(url, dest, cb) {
  var file = fs.createWriteStream('Downloading' + dest+ '.mov' );
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {

      file.close(cb);  
        // close() is async, call cb after close completes.
      console.log("downloadFinished");

        fs.rename('Downloading' + dest+ '.mov' , dest + '.mov', function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
        if(videoCounter%2 == 0 ){
          client.send('/layer3/clip1/connect',1);
        }else{
          client.send('/layer3/clip2/connect', 1);
        }
      });
    }).on('error', function(err) { // Handle errors
    fs.unlink('Downloading' + dest+ '.mov' ); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}
//download("https://twitter.com/GuillaumeTC/status/608746402693455872.html","vidazae.html")

stream.on('tweet', function (tweet) {
 	console.log("+++++ TWEET +++++ "  + "\n");
  
  if( tweet.extended_entities != null && tweet.retweeted_status == null){
    console.log(tweet);
    if (tweet.extended_entities.media[0].type == "video"){
    var videolink;
    var videoUrl = tweet.extended_entities.media[0].video_info.variants ;
      for(var i =0 ; i < videoUrl.length ; i++){
        if(videoUrl[i].bitrate == 832000 && videoUrl[i].content_type == 'video/mp4' ){
          videolink = videoUrl[i].url;
        }
      }
      console.log(videolink);

    download(videolink, 'videoTweet' + videoCounter );
      videoCounter = (videoCounter + 1) % 2;
    }
  }
});  

