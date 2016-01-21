var scraper = require('./scraper.js');
var slacker = require('./slacker.js');
var fs = require('fs');

var _ = require('underscore');
var diff = require('deep-diff');

var localFile = require("./LatestTeamUpdates.json");

function checkForDifference(){

  scraper.getLatestTeamUpdates(function(err, data){

    if( _.isEqual(data, localFile) !== true ){

      var difference = diff(data, localFile);

      for (var i = 0; i < difference.length; i++) {

        //Check for updates team updates based on date difference
        if(difference[i].kind == "E" && difference[i].path[2] == "date") {

          var title = data.team_updates[difference[i].path[1]].title;
          var url = data.team_updates[difference[i].path[1]].url;

          var message = title + " has been updated " + url;

          slacker.sendMessage(message) //Send Message to Slack
        }

        //Check for new updates
        if(difference[i].kind == "A"){

          var title = data.team_updates[0].title;
          var url = data.team_updates[0].url;

          var message = "A new update has been added - " + title + " " + url;

          slacker.sendMessage(message) //Send Message to Slack
        }

      }

      console.log(difference);

      // Lastly, save the new data in LatestTeamUpdates.json file
      fs.writeFile('LatestTeamUpdates.json', JSON.stringify(data), function (err) {

        if (err) return console.log(err);

      });

    }

  });

};


checkForDifference();
