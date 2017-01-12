var getLatestUpdates = require("./getLatestUpdates");

var _ = require("underscore");
var diff = require("deep-diff");
var Slack = require("slack-node");

var winston = require("winston");

function checkForTeamUpdates(options, callback) {
  if(options.debug) {
    winston.level = "debug";
  } else {
    winston.add(winston.transports.File, { filename: options.logPath });
    winston.remove(winston.transports.Console);
  }

  var slack = new Slack();
  slack.setWebhook(options.webhook);

  getLatestUpdates(options.updatesUri, function(err, data) {

    if(!_.isEqual(data, options.localUpdates)) {

      var difference = diff(data, options.localUpdatesPath);

      for (var i = 0; i < difference.length; i++) {

        // Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          var message = "@channel: " + title + " has been posted - " + url;

          slack.webhook({ text: message }, function(err, response) {
            if(err) {
              winston.error("Unexpected error occurred while sending message to Slack", { error: err });
            }
          });
        }

        // Check for new updates
        if(difference[i].kind == "A") {

          var title = data.team_updates[0].title;
          var url = data.team_updates[0].url;

          var message = "A new update has been posted - " + title + " " + url;

          slack.webhook({ text: message }, function(err, response) {
            if(err) {
              winston.error("Unexpected error occurred while sending message to Slack", { response: response, error: err});
            }
          });
        }
      }

      callback(err, data);
    }
  });
};

module.exports = checkForTeamUpdates;
