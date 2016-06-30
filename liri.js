//access the exports object
var twitterKeys = require("./keys");
//grab the parameter that the user inputs in the terminal
var liriOperation = process.argv[2];

console.log(twitterKeys.twitterkeys.options);

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
	var screenName = {screen_name: 'brewrhino'};
	twitterKeys.twitterkeys.get('statuses/user_timeline', screenName, function(error, tweets, response) {
		if (error) throw error;
		console.log(tweets);
		//console.log(response);
	});
}

function getSpotifyInfo() {

}

function getOMDBInfo() {

}