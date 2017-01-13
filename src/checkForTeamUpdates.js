var getLatestUpdates = require("./getLatestUpdates");

var _ = require("underscore");
var diff = require("deep-diff");
var Slack = require("slack-node");

function checkForTeamUpdates(options, callback) {
  var slack = new Slack();
  slack.setWebhook(options.webhook);

  console.log("Scraping for team updates...");

  getLatestUpdates(function(err, data) {

    if(err) {
      callback(err, null);
      return;
    }

    if(!_.isEqual(data, options.localUpdates)) {

      var difference = diff(data, options.localUpdates);

      console.log("Difference", JSON.stringify(difference));

      for (var i = 0; i < difference.length; i++) {

        // Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          console.log(
            "Difference detected. Sending message to Slack", 
            "@channel: " + title + " has been posted - " + url
          );

          var message = "@channel: " + title + " has been posted - " + url;

          slack.webhook({ text: message }, function(err, response) {
            if(err) {
              callback(err, null);
              return;
            }
          });
        }

        // Check for new updates
        if(difference[i].kind == "A") {

          var title = data.team_updates[0].title;
          var url = data.team_updates[0].url;

          console.log(
            "Difference detected. Sending message to Slack", 
            "A new update has been posted - " + title + " " + url
          );

          var message = "A new update has been posted - " + title + " " + url;

          slack.webhook({ text: message }, function(err, response) {
            if(err) {
              callback(err, null);
              return;
            }
          });
        }
      }
    } else {
      console.log("No difference detected");
    }

    callback(null, data);
  });
};

module.exports = checkForTeamUpdates;
