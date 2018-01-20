


const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')
const chat = require('../model/chat')
const dbPool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testlogin'
});

module.exports = {
    secret : 'yoursecret'
}

module.exports.finduserbyid = function(id, callback){
    dbPool.getConnection((err, connection)=>{
        connection.query('select * from user where id = id', id, (err, results) =>{
            let user = {}
            for(let i in results){
                user = results[i]
            }
            connection.release();
            callback(err, user);
            
        })
    })
}
   
module.exports.addUser = function(user, callback){
    console.log(user);
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(user.password, salt, (err, hash) =>{
            if(err) throw err;
            user.password = hash;
            dbPool.getConnection((err, connection) => {
               connection.query('insert into user set ?', user, ()=>{
                   connection.release();
                   callback(err, user)
               })
            })
        } )
    })
}

module.exports.getUserByUsername = function(user, callback){
    dbPool.getConnection((err, connection) => {
        connection.query('select * from user where username = ?', user, (err, results) => {
            let user = results[0];
            connection.release();
            callback(err, user);
            
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    console.log(hash)
    console.log(candidatePassword)
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}

module.exports.updateStatus = function(data, connected){
    dbPool.getConnection((err, connection) => {
        if(connected){
            console.log(connected);
            connection.query("update user Set status = 'online',  lastSeen = sysdate() where id = ?", data.id, (err,results) =>{
                if(err) throw err;
                connection.release();
            })
        }
        else{
            console.log(connected);
            console.log(data);
            connection.query("update user Set status = 'offline',  lastSeen = sysdate() where id = ?", data, (err,results) =>{
                if(err) throw err;
                connection.release();
            })
        }
        
    })
}
module.exports.getGroupsforUser= function(data){
    return new Promise((resolve,reject)=>{
        dbPool.getConnection((err, connection) =>{
            connection.query("select * from chat c join registration r on c.id = r.chat_id where r.user_id = ?", data,(err, results) =>{
                if(err) throw err;
                let groups = results;
                connection.release();
                resolve(groups);
            })
        })
    })   
}

module.exports.insertGroup = function(name, userdata){
    return new Promise((resolve, reject) => {
        let generatedKey = uuid();
    console.log(generatedKey);
    let newChat = {};
    newChat = new chat.chat(generatedKey, name)
    console.log(newChat);
    let keyPair = [];
    for(x in userdata){
        keyPair.push({user_id: userdata[x].id, chat_id: newChat.id})
    }
    dbPool.getConnection((err,connection) => {
        connection.query('insert into chat set ?', newChat,(err, results)=>{
            if(err) throw err;
            connection.release();
            for(i in keyPair){
                insertRegistration(keyPair[i]);
            }
            resolve(newChat.id)
            
        })
        
    })
    })
    
}

module.exports.getUsers = function(){
    return new Promise((resolve,reject)=>{
        dbPool.getConnection((err, connection) =>{
            connection.query('select * from user',(err, results) =>{
                if(err) throw err;
                let users = results;
                connection.release();
                resolve(users);
            })
        })
    })   
}

function insertRegistration(keyPair){
    dbPool.getConnection((err,connection) => {
        console.log(keyPair);
        connection.query('insert into registration set ?', keyPair, (err, results) =>{
            if(err) throw err;
            connection.release();
        })
    })
}

module.exports.insertMsg = function(data){
    dbPool.getConnection((err,connection) => {
        console.log(data);
        connection.query('insert into message set ?', data, (err, results) =>{
            if(err) throw err;
            connection.release();
        })
    })
}

module.exports.userLeftGroup = function(group, user){
    dbPool.getConnection((err, connection) => {
        console.log(group.id);
        console.log(user);
        var query = connection.query('delete from registration where chat_id like ? and user_id = ?', [group.id, user], (err, results) => {
                if(err) throw err;
                connection.release();
                console.log(query.sql);
        })
        console.log(query.sql);
    })
}