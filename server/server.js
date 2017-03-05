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
    .then(text => res.status(200).json({text}))
    .catch(err => res.status(200).json({text: err.toString()}));
});

module.exports = app;
