var getLatestUpdates = require("./getLatestUpdates");

var fs = require("fs");
var _ = require("underscore");

var Slack = require("slack-node");
var slack = new Slack();

function sendMessage(message, data, callback) {
  slack.webhook({ text: message }, function(err, response) {
    if(err) {
      console.trace(err);
    } else {
      console.log("Successfully sent message.");
      callback(err, data, true);
    }
  });
}

function checkForTeamUpdates(options, callback) {
  slack.setWebhook(options.webhook);

  console.log("Scraping for team updates...");

  getLatestUpdates(function(err, data) {
    if(err) {
      callback(err, null, false);
      return;
    } else {
      console.log("Data", data);
    }

    var localUpdates = options.localUpdates || { team_updates: [] }

    if(!_.isEqual(data, localUpdates)) {
      var message = "Update \"" + data.team_updates[0].title + "\" has been posted: " + data.team_updates[0].url + " . ";
          message += "All of the team updates can be found at https://firstfrc.blob.core.windows.net/frc2017/Manual/TeamUpdates/TeamUpdates-combined.pdf";
      
      console.log("Difference detected. Sending message to Slack:", message);
      sendMessage(message, data, callback);
    } else {
      console.log("No difference detected.");
      callback(null, data, false);
    }
  });
};

module.exports = checkForTeamUpdates;
