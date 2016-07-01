//access the exports object
var twitter = require('twitter');
var twitterKeys = require("./keys");
var spotify = require('spotify');
var request = require('request');
//grab the parameter that the user inputs in the terminal
var liriOperation = process.argv[2];

switch(liriOperation) {
	case "my-tweets":
		getTweets();
		break;
	case "spotify-this-song":
		getSpotifyInfo();
		break;
	case "movie-this":
		getOMDBInfo();
		break;
	default:
		console.log("I don't understand your operation.  Please use my-tweets, spotify-this-song, or movie-this for results");
}

function getTweets() {
	var keys = twitterKeys.twitterKeys;
	var screenName = {screen_name: 'brewrhino'};

	var client = new twitter(
		keys
	);

	client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
		if (error) throw error;
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			console.log('================================');
		}
	});
}

function getSpotifyInfo() {
	spotify.search({type: 'track', query: 'I Want it That Way'}, function(err, data) {
		if (err) {
			console.log("Error occurred: " + err);
			return;
		}
		//console.log(data.tracks.items[0]);
		console.log(data.tracks.items[0].artists[0].name);
		console.log(data.tracks.items[0].name);
	});

}

function getOMDBInfo() {
	var movieTitleArgs = process.argv;
	console.log(movieTitleArgs);
	var movieTitle = "";

	for (var i = 3; i < movieTitleArgs.length; i++) {
		if (i > 2 && i < movieTitleArgs.length) {
			movieTitle = movieTitle + "+" + movieTitleArgs[i]; 
		} else {
			movieTitle += movieTitleArgs[i];
		}
	}
	console.log(movieTitle);

	var queryUrl = 'http://www.omdbapi.com/?t=' + movieTitle + "&tomatoes=true";

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			//console.log(data);
			console.log("Title: " + data.Title);
			console.log("Year: " + data.Year);
			console.log("IMDB Rating: " + data.imdbRating);
			console.log("Contry " + data.Country);
			console.log("Plot " + data.Plot);
			console.log("Actors " + data.Actors);
			console.log("Rotten Tomatoes Rating:  " + data.tomatoRating);
			console.log("Rotten Tomatoes URL " + data.tomatoURL);
		}
	});
}