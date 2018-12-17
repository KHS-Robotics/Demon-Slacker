const getLatestUpdate = require("./getLatestUpdate");
const s3Client = require('./s3Client');
const sendSlackMessage = require('./sendSlackMessage');
const _ = require("underscore");

const YEAR = new Date().getFullYear();

/**
 * Scrapes for team updates, checks with S3 to verify
 * if there is a new update, and if there is sends
 * a messages to Slack and puts the team update
 * to S3.
 */
function checkForTeamUpdates() {
  console.log("Scraping for team update...");

  getLatestUpdate()
    .catch(err => console.error("Error while web scraping.", err))
    .then(scraped => {
      console.log("Scraped update: ", scraped);
      
      s3Client.getLatestUpdate()
        .catch(err => console.error("Error while getting latest update on S3.", err))
        .then(updateOnS3 => {
          console.log("S3 update: ", updateOnS3);

          if(scraped.team_updates.length === 0) {
            return console.error("Scraped team update is empty!\nPerhaps team updates aren't up yet?");
          }

          if(!_.isEqual(scraped, updateOnS3)) {
            console.log("Difference detected.");

            var message = "\"" + scraped.team_updates[0].title + "\" has been posted: " + scraped.team_updates[0].url + " . ";
            message += "All of the team updates can be found at https://firstfrc.blob.core.windows.net/frc" + YEAR + "/Manual/TeamUpdates/TeamUpdates-combined.pdf";
        
            console.log("Sending message to Slack:", message);
            sendSlackMessage(message)
              .catch(err => console.error("Error while sending message to Slack.", err))
              .then(response => {
                console.log("Successfully sent message to Slack.", response);
              });

            s3Client.putLatestUpdate(scraped)
              .catch(err => console.error("Error while putting latest update to S3.", err))
              .then(response => console.log("Successfully updated latest update on S3.", response));
          } else {
            console.log("No team update detected.");
          }
        });
    });
};

module.exports = checkForTeamUpdates;
