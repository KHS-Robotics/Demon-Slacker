var fs = require("fs");
var checkForTeamUpdates = require("./src/checkForTeamUpdates");

// Create a "teamUpdates.json" file in the same folder as the script
// and put the following JSON in the file:
//      {
//          "team_updates": []
//      }
var localUpdatesPath = "./teamUpdates.json";

var options = {
    // the URI of your incoming slack webhook
    webhook: "https://hooks.slack.com/services/your/webhook",

    // the local team updates, this should start off as a JSON object with 
    // a team_updates property that"s an empty array and will populate itself
    // (see ./teamUpdates.json for an example)
    localUpdates: require(localUpdatesPath)
};

function callback(err, data, hadUpdate) {
    if(err) {
        console.trace(err);
    }

    if(hadUpdate) {
        fs.writeFile(localUpdatesPath, JSON.stringify(data), function(err) {
            if(err) {
                console.trace(err);
            } else {
                options.localUpdates = data;
                console.log("Saved new data.");
            }
        });
    }
}

checkForTeamUpdates(options, callback);
