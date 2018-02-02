import { User } from './user';
import { Message } from './message';

export class Group {
    id:string = '';
    admin_id: number = 0;
    name: string = '';
    lastMessage: string = '';
    // admin?: User;
    // users?: User[];
    // messages?: Message[];
}
