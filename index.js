let express = require('express');
let app = express();

app.use(express.static("statics/"));

/**
 * Handle the main route of the website
 */
app.get('/', (req, res) => {
    res.render('home.html.twig');
});

app.listen(80);