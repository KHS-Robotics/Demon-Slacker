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
var checkForTeamUpdates = require("frc-team-updates-slack-notifier");

// Create a "teamUpdates.json" file in the same folder as the script
var localUpdatesPath = "./teamUpdates.json";

var options = {
    // the URI of your incoming slack webhook
    webhook: "https://hooks.slack.com/services/rest/of/your/webhook/here",

    // the local team updates, this should start off as a JSON object with 
    // a team_updates property that"s an empty array and will populate itself
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
            console.trace(err);
        }

        console.log("Saved new data.", data);
    });
}

checkForTeamUpdates(options, saveData);
```
