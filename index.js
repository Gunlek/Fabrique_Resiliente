let express = require('express');
let app = express();

app.use(express.static("statics/"));
require('dotenv').config();

let reference_module = require('./src/reference.js');

app.use('/reference', reference_module);

/**
 * Handle the main route of the website
 */
app.get('/', (req, res) => {
    res.render('home.html.twig');
});

app.get('/home', (req, res) => {
    res.render('home.html.twig');
});

app.get('/myfactory', (req, res) => {
    res.render('my_factory.html.twig');
});

app.get('/docs', (req, res) => {
    res.render('docs.html.twig');
});
app.listen(process.env.DEBUG == "true" ? parseInt(process.env.DEBUG_SERVER_PORT) : parseInt(process.env.PROD_SERVER_PORT));