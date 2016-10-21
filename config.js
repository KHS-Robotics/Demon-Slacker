var config = {
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
    webhookUri: "https://hooks.slack.com/services/RestOfUrlHere"
}

module.exports = config;
