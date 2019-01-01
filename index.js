'use strict';

const checkForTeamUpdate = require('./src/checkForTeamUpdate');
checkForTeamUpdate()
    .then(updated => console.log('Updated =>', updated))
    .catch(err => console.error(err));
