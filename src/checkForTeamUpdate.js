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
    .then(scraped => {
      console.log("Scraped update: ", scraped);
      
      s3Client.getLatestUpdate()
        .then(updateOnS3 => {
          console.log("S3 update: ", updateOnS3);

          if(scraped.team_updates.length === 0) {
            return console.error("Scraped team update is empty!\nPerhaps team updates aren't up yet?");
          }

          if(!_.isEqual(scraped, updateOnS3)) {
            console.log("Difference detected.");

            var message = "\"" + scraped.team_updates[0].title + "\" has been posted: " + scraped.team_updates[0].url + " . ";
            message += "All of the team updates can be found at https://firstfrc.blob.core.windows.net/frc" + YEAR + "/Manual/TeamUpdates/TeamUpdates-combined.pdf";
        
            console.log("Putting latest team update to S3.");
            s3Client.putLatestUpdate(scraped)
              .then(response => {
                console.log("Sending message to Slack:", message);
                sendSlackMessage(message)
                  .then(response => console.log("Successfully sent message to Slack.", response))
                  .catch(err => console.error("Error while sending message to Slack.", err));
              })
              .catch(err => console.error("Error while putting latest team update to S3. NOT sending to Slack.", err));
          } else {
            console.log("No team update detected.");
          }
        })
        .catch(err => console.error("Error while getting latest update on S3.", err));
    })
    .catch(err => console.error("Error while web scraping.", err));
};

module.exports = checkForTeamUpdates;
