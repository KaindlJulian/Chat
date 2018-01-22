import { Group } from './group';
import { User } from './user';

export class Message {
    sender: User;
    group: Group;
    msg: String;
    sendTime: Date;
}
