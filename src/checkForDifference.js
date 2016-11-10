var getLatestUpdates = require("./getLatestUpdates");
var Slacker = require("./slacker");

var _ = require("underscore");
var diff = require("deep-diff");

var defaultConfig = require("./config");

var winston = require("winston");
if(config.debug) {
  winston.level = "debug";
} else {
  winston.add(winston.transports.File, { filename: "../data/logs.log" });
  winston.remove(winston.transports.Console);
}

var slacker = new Slacker(defaultConfig.webhookUri);

function checkForDifference(callback, config) {
  config = config || defaultConfig;
  slacker.setWebhook(config.webhookUri);

  getLatestUpdates(function(err, data) {

    if(!_.isEqual(data, config.updatesPath)) {

      var difference = diff(data, config.updatesPath);

      for (var i = 0; i < difference.length; i++) {

        // Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          var message = "@channel: " + title + " has been posted - " + url;

          slacker.sendMessage(message, function(err, response) {
            if(err) {
              winston.error("Unexpected error occurred while sending message to Slack", { response: response, error: err });
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
              winston.error("Unexpected error occurred while sending message to Slack", { response: response, error: err});
            }
          });
        }
      }

      winston.log("Difference: " + difference);

      if(config.runForever) {
        winston.debug("Done differentiating. Will check again in " + config.sleepMinutes + " minutes");
      } else {
        winston.log("Done differentiating");
      }

      callback(err, data, winston);
    }
  });
};

module.exports = checkForDifference;
