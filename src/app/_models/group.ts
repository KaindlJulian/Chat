import { User } from './user';
import { Message } from './message';

export class Group {
    id:string = '';
    admin_id: number = 0;
    name: string = '';
    lastMessage: Message = null;
    avatar_url:string = '';
}
