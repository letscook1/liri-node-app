require("dotenv").config();

var moment = require("moment");
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");
function userCommand(userInput, userQuery) {
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this-song":
      spotifyThisSong();
      break;
    case "movie-this":
      movieThis();
      break;
    case "do-what-it-says":
      doThis(userQuery);
      break;
    default:
      console.log("This doesn't work");
      break;
  }
}

userCommand(userInput, userQuery);

function concertThis() {
  console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);

  if (!userQuery) {
    userQuery = "The Sign";
  }
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        userQuery +
        "/events?app_id=" +
        keys.bandsintown
    )
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log(
          `\nBand or Artist Info\n\nArtist: ${
            response.data[i].lineup[0]
          } \nVenue: ${response.data[i].venue.name}\nVenue Location: ${
            response.data[i].venue.latitude
          },${response.data[i].venue.longitude}\nVenue City: ${
            response.data[i].venue.city
          }, ${response.data[i].venue.country}`
        );

        var concertDate = moment(response.data[i].datetime).format(
          "MM/DD/YYYY hh:00 A"
        );
        console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
      }
    });
}

function spotifyThisSong() {
  console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);

  if (!userQuery) {
    userQuery = "the sign ace of base";
  }

  spotify.search(
    {
      type: "track",
      query: userQuery,
      limit: 1
    },
    function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }

      var spotifyArr = data.tracks.items;

      for (i = 0; i < spotifyArr.length; i++) {
        console.log(
          `\nSong Information\n\nArtist: ${
            data.tracks.items[i].album.artists[0].name
          } \nSong: ${data.tracks.items[i].name}\nAlbum: ${
            data.tracks.items[i].album.name
          }\nSpotify link: ${
            data.tracks.items[i].external_urls.spotify
          }\n\n - - - - -`
        );
      }
    }
  );
}

function movieThis() {
  console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);
  if (!userQuery) {
    userQuery = "mr nobody";
  }

  axios
    .get(
      "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      console.log(
        `\nFilm Information\n\nTitle: ${response.data.Title}\nCast: ${
          response.data.Actors
        }\nReleased: ${response.data.Year}\nIMDb Rating: ${
          response.data.imdbRating
        }\nRotten Tomatoes Rating: ${
          response.data.Ratings[1].Value
        }\nCountry: ${response.data.Country}\nLanguage: ${
          response.data.Language
        }\nPlot: ${response.data.Plot}\n\n- - - - -`
      );
    });
}

function doThis() {
  fs.readFile("random.txt", "UTF8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    var dataArr = data.split(",");

    userInput = dataArr[0];
    userQuery = dataArr[1];

    userCommand(userInput, userQuery);
  });
}
