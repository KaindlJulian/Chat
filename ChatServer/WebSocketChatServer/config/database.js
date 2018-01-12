
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const dbPool = mysql.createPool({
    connectionLimit: 10,
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