import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { User } from '../_models/user';
import { Message } from '../_models/messages';
import { Event } from '../_models/event';

import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';
const JWT_TOKEN = localStorage.getItem('currentUser');

@Injectable()
export class SocketService {

    private socket;

    public initSocket(): void {
        this.socket = io.connect(SERVER_URL ,
            {'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }}
        );    
    }

    public createChat(name: string, users: User[]): void{
        socket.emit('createChat', ({name: name, user: users}));
    }

    public onEvent(event: Event): Observable: any {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public disconnect(): void {
        socket.disconnect();
    }

    public sendMessage(msg: Message): void{
        socket.emit('sendMessage',({
            sender_id : msg.sender_id,
            receiver_id : msg.receiver_id,
            msg : msg.msg,
            sendTime : msg.sendTime
        }));
    }

}
