import { Group } from './group';
import { User } from './user';

export class Message {
    sender_id: number = 0;
    receiver_id: string = '';
    msg: string = '';
    sendTime: Date = new Date();
}
