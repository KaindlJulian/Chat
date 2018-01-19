import { User } from './user';

export class Message {
    sender_id: string;
    receiver_id: User[];
    msg: string;
    sendTime: Date;
}
