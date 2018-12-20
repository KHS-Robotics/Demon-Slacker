'use strict';

const checkForTeamUpdate = require('./src/checkForTeamUpdate');
checkForTeamUpdate()
    .catch(err => {
        console.error(err.message);

        if(err.error) {
            console.error(err.error);
        }
    });
