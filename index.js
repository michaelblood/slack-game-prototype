const app = require ('./server/server');
const mongoose = require('mongoose');
global.Promise = require('bluebird');
require('dotenv').config();

const uri = process.env.MONGOURI

const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
};
mongoose.Promise = global.Promise;
mongoose.connect(uri, options);
mongoose.connection.on('error', (err) => {
  console.log(err);
  console.log('failed to connect to db. exiting...');
  process.exit(1);
})

const port = app.get('port');
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
