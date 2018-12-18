const checkForTeamUpdate = require('./src/checkForTeamUpdate');
checkForTeamUpdate()
    .then(updateDetected => {
        if(!updateDetected) {
            console.log("No Team Update Detected.");
        }
    })
    .catch(x => {
        console.error(x.message);

        if(x.error) {
            console.error(x.error);
        }
    });
