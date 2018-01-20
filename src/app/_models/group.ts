import { User } from './user';
import { Message } from './message';

export class Group {
    id: number;
    name: String;
    users: User[];
    messages: Message[];
}
