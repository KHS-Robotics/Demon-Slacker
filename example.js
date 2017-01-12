var fs = require("fs");
var checkForTeamUpdates = require("./src/checkForTeamUpdates");

var runForever = false;
var WAIT_MINUTES = 60;

var options = {
    webhook: "https://hooks.slack.com/services/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", // the URI of your incoming slack webhook
    updatesUri: "http://www.firstinspires.org/resource-library/frc/competition-manual-qa-system", // the URI with the team updates to scrape
    localUpdates: require("./teamUpdates.json") // the local team updates, this should start off as an emply JSON object and will populate itself
};

function saveData(err, data) {
    if(err) {
        console.error(err);
    }
    
    // Ideally you want to save the new data to a local JSON file in order for the program
    // to know what the last updates were when the program last checked
    fs.writeFile(localUpdatesPath, JSON.stringify(data), function(err) {
        if(err) {
            console.error(err);
        }

        console.log("Saved new data.");
    });
}

if(runForever) {
    setTimeout(checkForTeamUpdates(options, saveData), WAIT_MINUTES*1000*60);
} else {
    checkForTeamUpdates(options, saveData);
}

console.log("Will check every " + WAIT_MINUTES + " minutes");
