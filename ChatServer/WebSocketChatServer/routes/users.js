const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const user = require("../model/user");

const database = require("../config/database");
let onlineUser = new Map();
var returnrouter = function(io) {
  router.post("/register", (req, res, next) => {
    console.log(req.body);
    let newUser = new user.user(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.username,
      Date.now //Changed by Lucas Rosenberger from new Date() to actual
    );
    console.log(newUser);
    database.addUser(newUser, (err, user) => {
      if (err) res.json({ success: false, msg: "failed to register user" });
      else res.json({ success: true, msg: "user registered" });
    });
  });

  // Authenticate
  router.post("/authenticate", (req, res, next) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    database.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }
      console.log(user);
      database.comparePassword(password, user.PASSWORD, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          const token = jwt.sign({ data: user }, database.secret, {
            expiresIn: 604800, //1 week
          });

          res.json({
            success: true,
            token: token,
            user: {
              name: user.name,
              username: user.username,
              email: user.email,
            },
          });
        } else {
          return res.json({ success: false, msg: "Password didnt match" });
        }
      });
    });
  });

  // Profile
  
  io.on("connection", async function(socket) {
    var connected = true;
    onlineUser.set(socket.id, socket.decoded_token.data.id);
    await database.updateStatus(socket.decoded_token.data, connected);

    let groups = await database.getGroupsforUser(socket.decoded_token.data.id);
    let users = await database.getUsers();
    for(x in groups){
      socket.join(groups[x].id);
    }
    socket.emit("success", ({groups: groups, users: users}));
    socket.broadcast.emit("getUsers", (users));
    //Argumente sind name des chats und ein Array aus Usern im JSON Format{name:'Chat with Boolean', users : Teilnehmer[]}
    socket.on("createChat", async data => {
      console.log(data);
      chatid = await database.insertGroup(data.name, data.users);
      data.user.forEach((val, ind, arr) =>{
        let socketOfUser = onlineUser.get(String(val.id));
        let socket = io.sockets.sockets[socketOfUser];
        socket.join(chatid);
      })
      
      
    });
    console.log("hello! ", socket.decoded_token.data.name);
    console.log("Authentication passed!");
    //Als argument sollte hier eine Message und die Gruppe mitgeben werden im Json format{msg: 'asdf', group: group}
    socket.on('sendMessage',data =>{
      database.insertMsg({msg: data.msg, receiver_id: data.group.id, sender_id : socket.decoded_token.data.id, sendTime:new Date()});
      socket.to(data.group.id).emit('reiciveMessage', data.msg);
    })
    //Als argument sollte die Gruppe mitgegeben werden im JSON format{group: group}
    socket.on('leaveRoom', (data) =>{
      database.userLeftGroup(data.group, socket.decoded_token.data.id);
      socket.to(data.id).emit('leaveRoom', socket.decoded_token.data.name + ' left the Room')
      socket.leave(data.id);
    })
    socket.on("disconnect", async () => {
      console.log(onlineUser.get(socket.id));
      connected = false;
      await database.updateStatus(onlineUser.get(socket.id), connected);
      onlineUser.delete(socket.id);
      let updatedUsers = await database.getUsers();
      socket.broadcast.emit("getUsers", (updatedUsers));
      
    });
  });


  return router;
};
// Register

module.exports = returnrouter;
