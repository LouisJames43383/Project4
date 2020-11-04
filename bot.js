// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag '#tenet' hashtag, and 'thwg' hashtag.
var mediaArtsSearch = {q: "#mediaarts", count: 10, result_type: "recent"}; 
var tenetSearch = {q: "#tenet", count: 10, result_type: "recent"}; 
var thwgSearch = {q: "#thwg", count: 10, result_type: "recent"};
var tweetbotSearch = {q: "#tweetbot", count: 10, result_type: "recent"};

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', tenetSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str
		// ...and then we tell Twitter we want to retweet it!
        // create a string that copies all text from the 1st post
        var tweetContent = ''
        tweetContent = tweetContent.concat(data.statuses[0].text)
        // using a for loop to reverse all the text and store into a new string
        var reverse = '';
        for (var i=tweetContent.length-1; i>=0; i--) {
            reverse = reverse.concat(tweetContent[i])
        }
        // create a post method to post the reversed text with the retweet
        var rP = {
            status: reverse
        }
        T.post('statuses/update',rP)
		T.post('statuses/retweet/' + retweetId, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
                console.log(reverse)
                //clear the two variables for next-time usage
                tweetContent = ''
                reverse = ''
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter: ', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search: ', error);
	  }
	});
}

function thwgLatest() {
	T.get('search/tweets', thwgSearch, function (error, data) {
	 console.log(error, data);
	if (!error) {
	var retweetId = data.statuses[0].id_str;
	T.post('statuses/retweet/' + retweetId, function(error, response) {
		if (response) {
			console.log('Success! Check your bot, it should have retweeted something.'); 
			}
		if (error) {
				console.log('There was an error with Twitter: ', error);
			}
		})
	}
	else {
	       console.log('There was an error with your hashtag search: ', error);
	}
})
}

// a method that likes tweets with hashtag tweetbot
function tweetbotLike() {
	T.get('search/tweets', tweetbotSearch, function(error, data) {
		console.log(error, data);
	    var likeId = data.statuses[0].id_str;
	    T.post('favorites/create', {id:likeId}, function(error ,response) {
		    if (response) {
			console.log("just liked a post")
		    }
		    if (error) {
			console.log('There was an error with Twitter: ', error);
			}
	    });
	    console.log(data);
	});
}
// Try to retweet something as soon as we run the program...
retweetLatest();
thwgLatest();
tweetbotLike();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60 * 24); //daily
setInterval(thwgLatest, 1000 * 60 * 60 * 24 * 7); //weekly
setInterval(tweetbotLike(), 1000 * 60 * 60); //hourly
