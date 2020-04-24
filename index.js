let express = require('express');
let app = express();

app.use(express.static("statics/"));

/**
 * Handle the main route of the website
 */
app.get('/', (req, res) => {
    res.render('presentation.html.twig');
});

app.get('/myfactory', (req, res) => {
    res.render('my_factory.html.twig');
});

app.get('/docs', (req, res) => {
    res.render('docs.html.twig');
});
app.listen(1234);