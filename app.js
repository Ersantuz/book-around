const express = require('express');
const path = require('path');
const { getBooks, newBook  } = require('./services/queryService');

// App
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Routes
// Map
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/data', async (req, res) => {
    try {
        const rows = await getBooks();
        res.send(rows);
    } catch (err) {
        res.send(err);
    }
});

// Form
app.get('/form', function(req, res) {
    res.sendFile(__dirname + '/static/form.html');
});

app.post('/form', async (req, res) => {
    try {
        // get url parameter
        await newBook(req.body);
        res.redirect('/');
    } catch (err) {
        res.send(err);
    }
});

// Server
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});