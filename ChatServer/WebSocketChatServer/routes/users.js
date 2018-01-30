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
      new Date() //Changed by Lucas Rosenberger from new Date() to actual
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

  io.on("connection", async (socket) => {
    var connected = true;
    onlineUser.set(socket.id, socket.decoded_token.data.id);
    let success = await database.updateStatus(
      socket.decoded_token.data,
      connected
    );

    let groups = await database.getGroupsforUser(socket.decoded_token.data.id);
    console.log(success);

    let users = await database.getUsers();
    console.log(users);
    let msg = [];

    for (x in groups) {
      msg.push(await database.getLastMessagesFromUser(groups[x]));
      socket.join(groups[x].id);
    }
    socket.emit("success", { groups: groups, users: users, msgs: msg });
    socket.broadcast.emit("getUsers", users);

    console.log("hello! ", socket.decoded_token.data.name);
    console.log("Authentication passed!");

    //Argument sind der Chat im JSON Format{group: groupObjekt}
    socket.on("openChat", async data => {
      allMessages = await database.getAllMessagesFromChat(data.group);
      socket.emit("sendMessages", { msgs: allMessages });
    });

    //Argumente sind name des chats und ein Array aus Usern im JSON Format{name:'Chat with Boolean', users : Teilnehmer[]}
    socket.on("createChat", async data => {
      console.log(data);
      let chatid = await database.insertGroup(data.name, data.users, socket.decoded_token.data.id);
      data.users.forEach((val, ind, arr) => {
        //©Matthias Herzog
        let socks = Object.keys(io.sockets.sockets);
        
        for(con of socks) {
          console.log(val);
          console.log("||")
          console.log(onlineUser.get(String(con)))
          if (onlineUser.get(String(con)) == val.id) {
            console.log("105");
            console.log(io.sockets.sockets[con]);
            io.sockets.sockets[con].join(chatid);
            io.sockets.sockets[con].emit("groupJoin", { groupName: data.name });
            io.sockets.sockets[con].emit("newGroup", {
              group: { id: chatid, name: data.name, creator: socket.decoded_token.data.id },
              lastmsg: {},
            });
          }
        }
      });
    });

    //Argumente sind die Gruppe und der hinzuzufügende User im JSON Format{group: groupObjekt, user: user}
    socket.on("addUser", async data => {
      let keyValuePair = [{ user_id: data.user.id, chat_id: data.group.id }];
      console.log("103: " + keyValuePair);
      let success = await database.checkRegistration(keyValuePair);
      let socks = Object.keys(io.sockets.sockets);
      if (success) {
        for (x of socks) {
          console.log(onlineUser.get(String(x)));
          if (onlineUser.get(String(x)) == data.user.id) {
            io.sockets.sockets[x].join(data.group.id);
            io.sockets.sockets[x].emit("groupJoin", {
              groupName: data.group.name,
              success: success,
            });
            let msg = await database.getLastMessagesFromUser(data.group);
            io.sockets.sockets[x].emit("newGroup", {
              group: { id: data.group.id, name: data.group.name, creator: socket.decoded_token.data.id},
              lastmsg: msg,
            });
          }
        }
      } else {
        socket.emit("groupJoin", {
          groupName: data.group.name,
          success: success,
        });
      }
    });

    //Als argument sollte hier eine Message und die Gruppe mitgeben werden im Json format{msg: 'asdf', group: group}
    socket.on("sendMessage", data => {
      database.insertMsg({
        msg: data.msg,
        receiver_id: data.group,  //.id
        sender_id: socket.decoded_token.data.id,
        sendTime: new Date(),
      });
      socket.to(data.group.id).emit("receiveMessage", data.msg);
    });

    //Als argument sollte die Gruppe mitgegeben werden im JSON format{group: group}
    socket.on("leaveRoom", data => {
      database.userLeftGroup(data.group, socket.decoded_token.data.id);
      socket
        .to(data.id)
        .emit(
          "userLeftRoom",
          socket.decoded_token.data.name + " left the Room"
        );
      socket.leave(data.id);
    });

    socket.on("disconnect", async () => {
      console.log(onlineUser.get(socket.id));
      connected = false;
      let success = await database.updateStatus(
        onlineUser.get(socket.id),
        connected
      );
      onlineUser.delete(socket.id);
      let updatedUsers = await database.getUsers();
      socket.broadcast.emit("getUsers", updatedUsers);
    });
  });

  return router;
};
// Register

module.exports = returnrouter;
