# FRC Team Updates Slack Notifier
Automatically notify your team about an update to the FRC game manual.

## How it works
First, we scrape the website for the current posted updates using [request-promise](https://www.npmjs.com/package/request-promise) to load the HTML from the team updates page and [cheerio](https://www.npmjs.com/package/cheerio) to traverse it. Then, we compare the traversed team updates from the page and the local updates saved in a JSON using [underscore](https://www.npmjs.com/package/underscore)'s `isEqual` function. If the JSON objects are different, we generate and  send the proper message with the update information to [slack](https://www.slack.com/) using [slack-node](https://www.npmjs.com/package/slack-node).

## Example
See `example.js`.