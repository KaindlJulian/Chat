module.exports.message = class{
    constructor(sender_id, receiver_id, msg, sendTime){
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.msg = msg;
        this.sendTime = sendTime;
    }
}