var scraper = require('./src/scraper.js');
var slacker = require('./src/slacker.js');
var fs = require('fs');

var _ = require('underscore');
var diff = require('deep-diff');

var config = require("./config.json");
var localUpdates = require("./data/LatestTeamUpdates.json");

slacker.setWebhookUri(config.slack.webhookUri)

function checkForDifference() {

  scraper.getLatestTeamUpdates(config.updatesUri, function(err, data) {

    if( _.isEqual(data, localUpdates) !== true ) {

      var difference = diff(data, localUpdates);

      for (var i = 0; i < difference.length; i++) {

        // Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          var message = "@channel: " + title + " has been posted - " + url;

          slacker.sendMessage(message) // Send Message to Slack
        }

        // Check for new updates
        if(difference[i].kind == "A") {

          var title = data.team_updates[0].title;
          var url = data.team_updates[0].url;

          var message = "A new update has been posted - " + title + " " + url;

          slacker.sendMessage(message) // Send Message to Slack
        }
      }

      console.log("Difference: " + difference);

      // Lastly, save the new data in LatestTeamUpdates.json file
      fs.writeFile('./data/LatestTeamUpdates.json', JSON.stringify(data), function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  });
};

checkForDifference();
