(function(env) {
    if(!env.SLACK_WEBHOOK_URL) {
        throw Error("Please set your SLACK_WEBHOOK_URL env variable!");
    }
})(process.env);

const fs = require("fs");
const checkForTeamUpdates = require("./src/checkForTeamUpdates");

const localUpdatesPath = "./teamUpdates.json";
if(!fs.existsSync()) {
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
    if(err) {
        return console.trace(err);
    }

    if(hadUpdate) {
        fs.writeFile(localUpdatesPath, JSON.stringify(data), function(err) {
            if(err) {
                return console.trace(err);
            }

            options.localUpdates = data;
            console.log("Saved new data.");
        });
    }
}

checkForTeamUpdates(options, callback);
