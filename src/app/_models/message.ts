import { Group } from './group';
import { User } from './user';

export class Message {
    sender_id: number = 0;
    sender: User = null;
    receiver_id: string = '';
    // receiver?: Group
    msg: string = '';
    // msg?: Message;
    sendTime: Date = new Date();
}
