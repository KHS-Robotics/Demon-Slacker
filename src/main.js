var fs = require("fs");
var checkForDifference = require("./checkForDifference");
var config = require("./config");

function saveData(err, data, winston) {
    fs.writeFile(config.updatesPath, JSON.stringify(data), function (err) {
        if (err) {
            winston.error("Unexpected error occurred while writing updated data", { error: err });
        }
    });
}

if(config.runForever) {
  setTimeout(function() {
      checkForDifference(saveData);
  }, config.sleepMinutes*60*1000);
} else {
  checkForDifference(saveData);
}
