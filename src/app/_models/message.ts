import { Group } from './group';
import { User } from './user';

export class Message {
    sender_id = 0;
    receiver_id = 0;
    msg: string = '';
    sendTime: Date = new Date();
}
