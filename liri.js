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
		//using the same process for omdb api, but this one requires a space for songs with more than one word.  The omdb api needs a '+'.  Need to refactor later.
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
		getSpotifyInfo(song);
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
	var addContent = "";

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
			fs.appendFile('log.txt', (i + 1) + "\n" + tweets[i].text + "\n" + tweets[i].created_at + "\n" + "===============================\n", function(err) {
				if (err) {
					console.log(err);
				} 
			})
		}
		console.log("Your tweets added to log.txt!");
	});
}

function getSpotifyInfo(userInput) {

	spotify.search({type: 'track', query: userInput}, function(err, data) {
		if (err) {
			console.log("Error occurred: " + err);
			return;
		}
		for (var i = 0; i < data.tracks.items.length; i++) {
			console.log(i + 1);
			console.log("Artist: " + data.tracks.items[i].artists[0].name);
			console.log("Song name: " + data.tracks.items[i].name);
			console.log("Preview link: " + data.tracks.items[i].preview_url);
			console.log("Album: " + data.tracks.items[i].album.name);
			console.log("==============================")
			fs.appendFile('log.txt', "Artist: " + data.tracks.items[i].artists[0].name + "\nSong name: " + data.tracks.items[i].name + "\nPreview link: " + data.tracks.items[i].preview_url + "\nAlbum: " + data.tracks.items[i].album.name + "\n==============================\n\n", function(err) {
				if (err) {
					console.log(err);
				}
			}) 
		}
		console.log("Spotify data added to log.txt!");
	});
}

function getOMDBInfo(userInput) {

	var queryUrl = 'http://www.omdbapi.com/?t=' + userInput + "&tomatoes=true";

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
		fs.appendFile('log.txt',"Movie Info" + "\nTitle: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nCountry: " + data.Country + "\nPlot: " + data.Plot + "\nActors " + data.Actors + "\nRotten Tomatoes Rating: " + data.tomatoRating + "\nRotten Tomatoes URL: " + data.tomatoURL + "\n\n", function(err) {
			if (err) {
				console.log(err);
			}
		})
		console.log("Movie data added to log.txt!");
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