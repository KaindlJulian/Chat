
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");
const chat = require("../model/chat");
const dbPool = mysql.createPool({
  connectionLimit: 50,
  host: "localhost",
  user: "root",
  password: "",
  database: "testlogin",
});

module.exports = {
  secret: "yoursecret",
};

module.exports.finduserbyid = function(id, callback) {
  dbPool.getConnection((err, connection) => {
    connection.query("select * from user where id = id", id, (err, results) => {
      let user = {};
      for (let i in results) {
        user = results[i];
      }
      connection.release();
      callback(err, user);
    });
  });
};

module.exports.checkUserName = function(userName){
  return new Promise((resolve, reject) =>{
    dbPool.getConnection((err, connection) => {
      connection.query("select * from user where username = ?", userName, (err, results) => {
        if(err) throw err;
        console.log(results);
        connection.release();
        let success;
        if(results.length > 0){
          success = false;
          resolve(success);
        }
        else{
          success = true;
          console.log(success)
          resolve(success);
        }
      })
    })
  })
  
}

module.exports.addUser = function(user, callback) {
  console.log(user);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      dbPool.getConnection((err, connection) => {
        connection.query("insert into user set ?", user, () => {
          connection.release();
          callback(err, user);
        });
      });
    });
  });
};

module.exports.getUserByUsername = function(user, callback) {
  dbPool.getConnection((err, connection) => {
    connection.query(
      "select * from user where username = ?",
      user,
      (err, results) => {
        let user = results[0];
        connection.release();
        callback(err, user);
      }
    );
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  console.log(hash);
  console.log(candidatePassword);
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.updateStatus = function(data, connected) {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) => {
      if (err) throw err;
      if (connected) {
        console.log("73:" + connected);
        connection.query(
          "update user Set status = 'online',  lastSeen = sysdate() where id = ?",
          data.id,
          (err, results) => {
            if (err) throw err;
            connection.release();
          }
        );
      } else {
        console.log("80:" + connected);
        console.log(data);
        connection.query(
          "update user Set status = 'offline',  lastSeen = sysdate() where id = ?",
          data,
          (err, results) => {
            if (err) throw err;
            connection.release();
          }
        );
      }

      resolve(1);
    });
  });
};
module.exports.getGroupsforUser = function(data) {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) => {
      connection.query(
        "select * from chat c join registration r on c.id = r.chat_id where r.user_id = ?",
        data,
        (err, results) => {
          if (err) throw err;
          let groups = results;
          connection.release();
          resolve(groups);
        }
      );
    });
  });
};

module.exports.insertGroup = function(name, userdata, creator_id) {
  return new Promise((resolve, reject) => {
    let generatedKey = uuid();
    console.log(generatedKey);
    let newChat = {};
    newChat = new chat.chat(generatedKey, name, creator_id);
    console.log(newChat);
    let keyPair = [];
    for (x in userdata) {
      keyPair.push({ user_id: userdata[x].id, chat_id: newChat.id });
    }
    dbPool.getConnection((err, connection) => {
      connection.query("insert into chat set ?", newChat, (err, results) => {
        if (err) throw err;
        connection.release();
        for (i in keyPair) {
          insertRegistration(keyPair[i]);
        }
        resolve(newChat.id);
      });
    });
  });
};

module.exports.getUsers = function() {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) => {
      connection.query("select * from user", (err, results) => {
        if (err) throw err;
        let users = results;
        connection.release();
        resolve(users);
      });
    });
  });
};

insertRegistration = function(keyPair) {
  dbPool.getConnection((err, connection) => {
    console.log(keyPair);
    connection.query(
      "insert into registration set ?",
      keyPair,
      (err, results) => {
        if (err) throw err;
        connection.release();
      }
    );
  });
};

module.exports.insertMsg = function(data) {
  dbPool.getConnection((err, connection) => {
    console.log(data);
    connection.query("insert into message set ?", data, (err, results) => {
      if (err) throw err;
      connection.release();
    });
  });
};

module.exports.userLeftGroup = function(group, user) {
  dbPool.getConnection((err, connection) => {
    console.log(group.id);
    console.log(user);
    var query = connection.query(
      "delete from registration where chat_id like ? and user_id = ?",
      [group.id, user],
      (err, results) => {
        if (err) throw err;
        connection.release();
        console.log(query.sql);
      }
    );
    console.log(query.sql);
  });
};
module.exports.getLastMessagesFromUser = function(group) {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) => {
      connection.query(
        "select * from message where receiver_id = ? order by sendtime DESC limit 1",
        group.id,
        (err, result) => {
          if (err) throw err;
          connection.release();
          resolve(result);
        }
      );
    });
  });
};
module.exports.getAllMessagesFromChat = function(group) {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) => {
      connection.query(
        "select * from message where receiver_id = ? order by sendtime DESC",
        group.id,
        (err, result) => {
          if (err) throw err;
          connection.release();
          resolve(result);
        }
      );
    });
  });
};
module.exports.checkRegistration = function(keyPair){
  console.log(keyPair[0])
  return new Promise((resolve, reject)=>{
    dbPool.getConnection((err, connection) =>{
      connection.query("select * from registration where chat_id = ? and user_id = ?", [keyPair[0].chat_id, keyPair[0].user_id], (err, result) => {
        if(err) throw err;
        console.log(result);
        connection.release();
        let success;
        if(result.length > 0){
          success = false;
          resolve(success);
        }
        else{
          success = true;
          console.log(success)
          insertRegistration(keyPair);
          resolve(success);
        }
          
        
      })
    })
  })
}
module.exports.checkForAdmin = function(userId, groupId){
  return new Promise((resolve, reject) => {
    dbPool.getConnection((err, connection) =>{
      connection.query("select * from chat where creator_id = ? and id = ?",[userId, groupId], (err, result) =>{
        if(err) throw err;
        console.log(result);
        connection.release();
        let success;
        if(result.length > 0){
          success = false;
          resolve(success);
        }
        else{
          success = true;
          console.log(success)
          insertRegistration(keyPair);
          resolve(success);
        }
      })
    })
  })
}
