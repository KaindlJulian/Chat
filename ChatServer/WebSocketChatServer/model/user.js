module.exports.user = class{

    constructor(name, email, password, username, lastSeen){
        this.name = name
        this.email = email
        this.password = password
        this.username = username
        this.lastSeen = lastSeen
    }
}