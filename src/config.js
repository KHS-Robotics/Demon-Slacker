/**
 * Default config values. This is used if checkForDifference is
 * called without passing the 'config' parameter
 */
var config = {
    /*
     * debug: used to direct the logger to either
     * the console (true) or a log file (false)
     * at ~/data/logs.log
    */
    debug: false,
    /*
     * runForever: tells the program to run forever 
    */
    runForever: false,
    /*
     * sleepMinutes: how long the program should wait between checking
     * when runForever is set to true
    */
    sleepMinutes: 15,
    /*
     * webhookUri: your team's Slack incoming webhook token here.
     * Remember: Don't commmit this anywhere! Treat it as a password
    */
    webhookUri: "https://hooks.slack.com/services/RestOfUrlHere",
    /**
     * updatesPath: the file path to the JSON to compare the scraped
     * data with
     */
    updatesPath: "./data/LocalUpdates.json"
}

module.exports = config;
