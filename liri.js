require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var movieName = process.argv[3];
var liriReturn = process.argv[2];

switch (liriReturn) {
  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}

function spotifyThisSong(trackName) {
  var trackName = process.argv[3];
  if (!trackName) {
    trackName = "Yakety Sax";
  }
  songRequest = trackName;
  spotify.search(
    {
      type: "track",
      query: songRequest
    },
    function(err, data) {
      if (!err) {
        var trackInfo = data.tracks.items;
        for (var i = 0; i < 5; i++) {
          if (trackInfo[i] != undefined) {
            var spotifyResults =
              "Artist: " +
              trackInfo[i].artists[0].name +
              "\n" +
              "Song: " +
              trackInfo[i].name +
              "\n" +
              "Preview URL: " +
              trackInfo[i].preview_url +
              "\n" +
              "Album: " +
              trackInfo[i].album.name +
              "\n";

            console.log(spotifyResults);
            console.log(" ");
          }
        }
      } else {
        console.log("error: " + err);
        return;
      }
    }
  );
}

function movieThis() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var myMovieData = JSON.parse(body);
      var queryUrlResults =
        "Title: " +
        myMovieData.Title +
        " " +
        "Year: " +
        myMovieData.Year +
        " " +
        "IMDB Rating: " +
        myMovieData.Ratings[0].Value +
        " " +
        "Rotten Tomatoes Rating: " +
        myMovieData.Ratings[1].Value +
        " " +
        "Origin Country: " +
        myMovieData.Country +
        " " +
        "Language: " +
        myMovieData.Language +
        " " +
        "Plot: " +
        myMovieData.Plot +
        " " +
        "Actors: " +
        myMovieData.Actors +
        " ";

      console.log(queryUrlResults);
    } else {
      console.log("error: " + err);
      return;
    }
  });
}

function doWhatItSays() {
  fs.writeFile("random.txt", 'spotify-this-song,"The Sign"', function(err) {
    var song = "spotify-this-song 'Yakety Sax'";

    if (err) {
      return console.log(err);
    }

    // Otherwise, it will print:
    console.log(song);
  });
}
