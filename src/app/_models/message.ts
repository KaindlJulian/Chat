import { User } from './user';

export class Message {
    sender: User;
    receiver: User[];
    msg: String;
    sendTime: Date;
}
