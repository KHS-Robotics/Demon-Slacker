require('dotenv').config();
(function (env) {
    if (!env.SLACK_WEBHOOK_URL) {
        throw Error("Please set your SLACK_WEBHOOK_URL env variable!"); // .env file with SLACK_WEBHOOK_URL=blah
    }
})(process.env);

const fs = require("fs");
const CronJob = require("cron").CronJob;
const checkForTeamUpdates = require("./src/checkForTeamUpdates");

const localUpdatesPath = "./teamUpdates.json";
if (!fs.existsSync()) {
    let blank = {
        team_updates: []
    };

    fs.writeFileSync(localUpdatesPath, JSON.stringify(blank));
}

var options = {
    // the URI of your incoming slack webhook
    webhook: process.env.SLACK_WEBHOOK_URL,
    localUpdates: require(localUpdatesPath)
};

function callback(err, data, hadUpdate) {
    if (err) {
        return console.trace(err);
    }

    if (hadUpdate) {
        fs.writeFile(localUpdatesPath, JSON.stringify(data), function (err) {
            if (err) {
                return console.trace(err);
            }

            options.localUpdates = data;
            console.log("Saved new data.");
        });
    }
}


var execute = function () {
    checkForTeamUpdates(options, callback);
    console.log("checkForTeamUpdates will execute again in 30 minutes");
};

return new CronJob("00 */30 * * * *", (function () {
    return execute();
}), null, true, "America/New_York");

