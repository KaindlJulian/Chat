
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');
const user = require('./model/user')


// Connect To Database


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var socketioJwt   = require("socketio-jwt");


io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true,
  auth_header_required: true
}));
const users = require('./routes/users')(io);

app.use(bodyParser.json());


// Port Number
const port = 3000;

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
server.listen(port, () => {
  console.log('Server started on port '+port);
});
