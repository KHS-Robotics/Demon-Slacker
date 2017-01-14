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
    } else {
      callback(null, data);
    }

    if(!_.isEqual(data, options.localUpdates)) {

      var difference = diff(data, options.localUpdates);

      console.log("Difference", JSON.stringify(difference));

      for (var i = 0; i < difference.length; i++) {

        // Check for new updates
        if(difference[i].kind == "A") {

          var newestUpdateTitle = data.team_updates[0].title;
          var newestUpdateUrl = data.team_updates[0].url;

          var combinedUpdatesUrl = data.team_updates[1].url;

          var message = "Update \"" + newestUpdateTitle + "\" has been posted (" + newestUpdateUrl + "). ";
          message += "All of the team updates can be found at " + combinedUpdatesUrl;

          console.log(
            "Difference detected. Sending message to Slack",
            message
          );

          slack.webhook({ text: message }, function(err, response) {
            if(err) {
              console.trace(err);
            }
          });

          break;
        }
      }
    } else {
      console.log("No difference detected");
    }
  });
};

module.exports = checkForTeamUpdates;
