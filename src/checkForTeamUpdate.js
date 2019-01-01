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
  return new Promise((resolve, reject) => {
    getLatestUpdate()
      .then(scraped => {
        console.log("Scraped update: ", scraped);

        if(scraped.team_updates.length === 0) {
          return reject(
            new Error("Scraped team update is empty! Perhaps team updates aren't up yet?")
          );
        }
        
        s3Client.getLatestUpdate()
          .then(updateOnS3 => {
            console.log("S3 update:", updateOnS3);

            if(_.isEqual(scraped, updateOnS3)) {
              console.log("No new team update detected.");
              return resolve(false);
            }

            console.log("New team update detected!");

            var message = "\"" + scraped.team_updates[0].title + "\" has been posted: " + scraped.team_updates[0].url + " . ";
            message += "All of the team updates can be found at https://firstfrc.blob.core.windows.net/frc" + YEAR + "/Manual/TeamUpdates/TeamUpdates-combined.pdf";
            
            console.log("Putting latest team update to S3.");
            s3Client.putLatestUpdate(scraped)
              .then(response => {
                console.log("Sending message to Slack:", message);
                sendSlackMessage(message)
                  .then(response => {
                    console.log("Successfully sent message to Slack.", response);
                    return resolve(true);
                  })
                  .catch(err => {
                    console.error("Error while sending message to Slack.");
                    return reject(err);
                  });
              })
              .catch(err => {
                console.error("Error while putting latest team update to S3. NOT sending to Slack.");
                return reject(err);
              });
          })
          .catch(err => {
            console.error("Error while getting latest update on S3.");
            return reject(err);
          });
      })
      .catch(err => {
        console.error("Error while web scraping.");
        return reject(err);
      });
  });
};

module.exports = checkForTeamUpdates;
