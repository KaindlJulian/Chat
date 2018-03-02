import { Group } from './group';
import { User } from './user';

export class Message {
    sender_id = 0;
    sender: User = null;
    receiver_id = '';
    msg = '';
    sendTime: Date = new Date();
}
