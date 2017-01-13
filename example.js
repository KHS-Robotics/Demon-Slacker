var fs = require("fs");
var checkForTeamUpdates = require("./src/checkForTeamUpdates");

var runForever = false;
var WAIT_MINUTES = 60;

var localUpdatesPath = "./teamUpdates.json";

var options = {
    // the URI of your incoming slack webhook
    webhook: "https://hooks.slack.com/services/rest/of/your/webhook/here",

    // the local team updates, this should start off as a JSON object with 
    // a team_updates property that's an empty array and will populate itself
    // (see ./teamUpdates.json for an example)
    localUpdates: require(localUpdatesPath)
};

function saveData(err, data) {
    if(err) {
        console.log(err);
    }
    
    // Ideally you want to save the new data to a local JSON file in order for the program
    // to know what the last updates were when the program last checked
    fs.writeFile(localUpdatesPath, JSON.stringify(data), function(err) {
        if(err) {
            console.error(err);
        }

        console.log("Saved new data.", data);
    });
}

if(runForever) {
    console.log("Will check every " + WAIT_MINUTES + " minutes");
    setTimeout(checkForTeamUpdates(options, saveData), WAIT_MINUTES*1000*60);
} else {
    checkForTeamUpdates(options, saveData);
}
