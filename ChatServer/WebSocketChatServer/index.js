
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');
const user = require('./model/user')


// Connect To Database

// SSL Files
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
// https://blog.cloudboost.io/everything-about-creating-an-https-server-using-node-js-2fc5c48a8d4e
var fs = require('fs');
var key = fs.readFileSync('./ssl/private.key');
var cert = fs.readFileSync( './ssl/certificate.crt' );
// options for server creation
var options = {
  key:  key,
  cert: cert
}

const app = express();
const httpServer = require('http').createServer(app);
//const httpsServer = require('https').createServer(options, app)
const io = require('socket.io')(httpServer);
var socketioJwt   = require("socketio-jwt");



io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true,
}));
const users = require('./routes/users')(io);

app.use(bodyParser.json());


// Port Number
const port = 3462;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware


app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
httpServer.listen(port, () => {
  console.log('Server started on port '+port);
});
