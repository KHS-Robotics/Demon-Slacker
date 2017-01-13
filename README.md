# FRC Team Updates Slack Notifier
Automatically notify your team about an update to the FRC game manual.

## How it works
The algorithm is simple, actually. First, we scrape the website for the current posted updates using [request-promise](https://www.npmjs.com/package/request-promise)
to load the HTML from the team updates page and [cheerio](https://www.npmjs.com/package/cheerio) to traverse it. Then, we compare the traversed team updates from the page
and the local updates saved in a JSON using [underscore](https://www.npmjs.com/package/underscore)'s `isEqual` function. If the JSON objects are different, then we 
use [deep-diff](https://www.npmjs.com/package/deep-diff) to compare the changes. We then send the proper message to [slack](https://www.slack.com/) using 
[slack-node](https://www.npmjs.com/package/slack-node) based on the differences in the local JSON object and what we pulled from the web.

## Example
```
var fs = require("fs");
var checkForTeamUpdates = require("frc-team-updates-slack-notifer");

var runForever = false;
var WAIT_MINUTES = 60;

var localUpdatesPath = "./teamUpdates.json";

var options = {
    webhook: "webhookUri", // the URI of your incoming slack webhook
    updatesUri: "http://www.firstinspires.org/resource-library/frc/competition-manual-qa-system", // the URI with the team updates to scrape
    localUpdates: require(localUpdatesPath) // the local team updates, this should start off as an emply JSON object and will populate itself
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
    })
}

if(runForever) {
    setTimeout(checkForTeamUpdates(options, saveData), WAIT_MINUTES*1000*60);
} else {
    checkForTeamUpdates(options, saveData);
}
```
