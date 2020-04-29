let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
let urlencoded = bodyParser.urlencoded();

let Promise = require('bluebird').Promise;
let sqlite = require('sqlite');

let dbPromise = sqlite.open('./database/database.sqlite', { Promise });


router.post('/insert-reference', urlencoded, async (req, res) => {
    let ref_tag = "azerty"; // TODO: Generate ref tag

    let ref_data = req.body.form_data;
    
    let db = await dbPromise;
    let stmt = await db.prepare('INSERT INTO reference(ref_tag, ref_json) VALUES(?, ?)');
    stmt.run([ref_tag, ref_data]);

    res.send("success");
});

router.get('/get-reference', urlencoded, async (req, res) => {
    let ref_tag = req.query.ref_tag; // TODO: Generate ref tag
    
    let db = await dbPromise;
    let results = await db.get('SELECT * FROM reference WHERE ref_tag=?', [ref_tag]);
    console.log(results);
    if (results==undefined) {res.send("Error");}
    else {res.send( results.ref_json );}
}

);

module.exports = router;