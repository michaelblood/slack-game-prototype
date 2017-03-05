const express = require('express');
const bodyParser = require('body-parser');

const { commands } = require('./routes');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', process.env.PORT || 3000);

// app.post('/api/button/*', (req, res) => {
  
// });

app.post('/api/*', (req, res) => {
  commands(req.body)
    .then(text => res.json({text}))
    .catch(err => res.json({text: err.toString()}));
});

module.exports = app;
