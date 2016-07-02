//access the exports object
var twitter = require('twitter');
var twitterKeys = require("./keys");
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
//grab the parameter that the user inputs in the terminal
var liriOperation = process.argv[2];

switch(liriOperation) {
	case "my-tweets":
		getTweets();
		break;
	case "spotify-this-song":
		var spotifySongArgs = process.argv;
		var song = "";

		if (process.argv[3]) {
			for (var i = 3; i < spotifySongArgs.length; i++) {
				if (i > 3 && i < spotifySongArgs.length) {
					song = song + " " + spotifySongArgs[i];
				} else {
					song += spotifySongArgs[i];
				}
			}
		} else {
			song = "What's My Age Again";
		}
		getSpotifyInfo();
		break;
	case "movie-this":
		var movieTitleArgs = process.argv;
		var movieTitle = "";

		if (process.argv[3]) {
			for (var i = 3; i < movieTitleArgs.length; i++) {
				if (i > 3 && i < movieTitleArgs.length) {
					movieTitle = movieTitle + "+" + movieTitleArgs[i]; 
				} else {
					movieTitle += movieTitleArgs[i];
				}
			}
		} else {
			movieTitle = "Mr. Nobody";
		}
		getOMDBInfo(movieTitle);
		break;
	case "do-what-it-says":
		readFileCommand();
		break;
	default:
		console.log("I don't understand your operation.  Please use my-tweets, spotify-this-song, or movie-this for results");
}

function getTweets() {
	var keys = twitterKeys.twitterKeys;
	var screenName = {screen_name: 'brewrhino', count: 20};

	var client = new twitter(
		keys
	);

	client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
		if (error) throw error;
		for (var i = 0; i < tweets.length; i++) {
			console.log(i + 1);
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			console.log('================================');
		}
	});
}

function getSpotifyInfo() {

	spotify.search({type: 'track', query: song}, function(err, data) {
		if (err) {
			console.log("Error occurred: " + err);
			return;
		}
		//console.log(data.tracks.items.length);
		for (var i = 0; i < data.tracks.items.length; i++) {
			console.log(i + 1);
			console.log("Artist: " + data.tracks.items[i].artists[0].name);
			console.log("Song name: " + data.tracks.items[i].name);
			console.log("Preview link: " + data.tracks.items[i].preview_url);
			console.log("Album: " + data.tracks.items[i].album.name);
			console.log("==============================")

		}
	});
}

function getOMDBInfo(userInput) {

	var queryUrl = 'http://www.omdbapi.com/?t=' + movieTitle + "&tomatoes=true";

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			console.log("Title: " + data.Title);
			console.log("Release Year: " + data.Year);
			console.log("IMDB Rating: " + data.imdbRating);
			console.log("Country " + data.Country);
			console.log("Plot " + data.Plot);
			console.log("Actors " + data.Actors);
			console.log("Rotten Tomatoes Rating:  " + data.tomatoRating);
			console.log("Rotten Tomatoes URL: " + data.tomatoURL);
		}
	});
}

function readFileCommand() {
	fs.readFile("random.txt", 'utf8', function(error, data) {
		var dataArr = data.split(',');
		var liriOperation = dataArr[0];
		var userInput = dataArr[1];

		switch(liriOperation) {
			case('my-tweets'):
				getTweets();
				break;
			case('spotify-this-song'):
				getSpotifyInfo(userInput);
				break;
			case('movie-this'):
				getOMDBInfo(userInput);
				break;
			default:
				console.log("I don't understand your operation.  Please choose between my-tweets, spotify-this-song, movie-this");
		}
	})
}