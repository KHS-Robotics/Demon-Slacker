# FRC Team Updates Slack Notifier
Automatically notify your team about an update to the FRC game manual.

## How it works
The algorithm is simple, actually. First, we scrape the website for the current posted updates using [request-promise](https://www.npmjs.com/package/request-promise)
to load the HTML from the team updates page and [cheerio](https://www.npmjs.com/package/cheerio) to traverse it. Then, we compare the traversed team updates from the page
and the local updates saved in a JSON using [underscore](https://www.npmjs.com/package/underscore)'s `isEqual` function. If the JSON objects are different, we generate and 
send the proper message with the update information to [slack](https://www.slack.com/) using  [slack-node](https://www.npmjs.com/package/slack-node).

## Example
```
var fs = require("fs");
var checkForTeamUpdates = require("./src/checkForTeamUpdates");

// Create a "teamUpdates.json" file in the same folder as the script
// and put the following JSON in the file:
//      {
//          "team_updates": [
//
//          ]
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
                console.log("Saved new data", data);
            }
        });
    }
}

checkForTeamUpdates(options, callback);
```
