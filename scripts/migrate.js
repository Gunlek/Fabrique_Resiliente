let sqlite = require('sqlite');
let Promise = require('bluebird').Promise;
let fs = require('fs');

Promise.resolve()
    .then(() => sqlite.open('./database/database.sqlite', { Promise }))
    .then(db => db.migrate({ force: 'last' }));