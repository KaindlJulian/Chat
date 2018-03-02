import { User } from './user';
import { Message } from './message';

export class Group {
    id = '';
    admin_id = 0;
    name = '';
    lastMessage: Message = null;
    avatar_url = '';
}
