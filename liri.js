require("dotenv").config();

var request = require("request");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb;
var bandsintown = keys.bandsintown;
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

  request(
    "https://rest.bandsintown.com/artists/" +
      userQuery +
      "/events?app_id=" +
      bandsintown,
    function(err, response, body) {
      if (!err && response.statusCode === 200) {
        var userBand = JSON.parse(body);

        if (userBand.length > 0) {
          for (i = 0; i < 1; i++) {
            console.log(
              `\nBand or Artist Info\n\nArtist: ${
                userBand[i].lineup[0]
              } \nVenue: ${userBand[i].venue.name}\nVenue Location: ${
                userBand[i].venue.latitude
              },${userBand[i].venue.longitude}\nVenue City: ${
                userBand[i].venue.city
              }, ${userBand[i].venue.country}`
            );

            var concertDate = moment(userBand[i].datetime).format(
              "MM/DD/YYYY hh:00 A"
            );
            console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
          }
        } else {
          console.log("Can't find information!");
        }
      }
    }
  );
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

  request(
    "http://www.omdbapi.com/?t=" + userQuery + "&apikey=86fe999c",
    function(err, response, body) {
      var userMovie = JSON.parse(body);

      var ratingsArr = userMovie.Ratings;
      if (ratingsArr.length > 2) {
      }

      if (!err && response.statusCode === 200) {
        console.log(
          `\nFilm Information\n\nTitle: ${userMovie.Title}\nCast: ${
            userMovie.Actors
          }\nReleased: ${userMovie.Year}\nIMDb Rating: ${
            userMovie.imdbRating
          }\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${
            userMovie.Country
          }\nLanguage: ${userMovie.Language}\nPlot: ${
            userMovie.Plot
          }\n\n- - - - -`
        );
      } else {
        return console.log("Can't find info! Error:" + err);
      }
    }
  );
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
