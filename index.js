var getLatestTeamUpdates = require("./src/getLatestTeamUpdates");
var Slacker = require("./src/slacker");
var fs = require("fs");

var _ = require("underscore");
var diff = require("deep-diff");

var config = require("./config");
var localUpdates = require("./data/LatestTeamUpdates.json");

var slacker = new Slacker(config.webhookUri);

function checkForDifference() {

  getLatestTeamUpdates(function(err, data) {

    if(!_.isEqual(data, localUpdates)) {

      var difference = diff(data, localUpdates);

      for (var i = 0; i < difference.length; i++) {

        // Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          var message = "@channel: " + title + " has been posted - " + url;

          slacker.sendMessage(message, function(err, response) {
            if(err) {
              console.err("Unexpected error occurred while sending message to Slack :: response = " + response);
            }
          });
        }

        // Check for new updates
        if(difference[i].kind == "A") {

          var title = data.team_updates[0].title;
          var url = data.team_updates[0].url;

          var message = "A new update has been posted - " + title + " " + url;

          slacker.sendMessage(message, function(err, response) {
            if(err) {
              console.err("Unexpected error occurred while sending message to Slack :: response = " + response);
            }
          });
        }
      }

      console.log("Difference: " + difference);

      // Lastly, save the new data in LatestTeamUpdates.json file
      fs.writeFile("./data/LatestTeamUpdates.json", JSON.stringify(data), function (err) {
        if (err) {
          return console.err("Unexpected error occurred while writing updated data" + err);
        }
      });

      if(config.runForever) {
        console.log("Will check again in " + config.sleepMinutes + " minutes");
      } else {
        console.log("Done");
      }
    }
  });
};

if(config.runForever) {
  console.log("Checking for game updates every " + config.sleepMinutes + " minutes...")
  setTimeout(checkForDifference, config.sleepMinutes*1000);
} else {
  console.log("Checking for game updates...");
  checkForDifference();
}
