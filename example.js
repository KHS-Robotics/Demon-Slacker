var fs = require("fs");
var checkForTeamUpdates = require("./src/checkForTeamUpdates");

var localUpdatesPath = "./teamUpdates.json";

var options = {
    debug: true,
    webhook: "https://hooks.slack.com/services/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",
    updatesUri: "http://www.firstinspires.org/resource-library/frc/competition-manual-qa-system",
    localUpdates: require(localUpdatesPath)
};

function saveData(err, data) {
    if(err) {
        console.log(err);
    }
    
    fs.writeFile(localUpdatesPath, JSON.stringify(data), function(err) {
        if(err) {
            console.error(err);
        }
    })
}

checkForTeamUpdates(options, saveData);
