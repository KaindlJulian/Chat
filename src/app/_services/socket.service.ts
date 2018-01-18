import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// models
import { User } from '../_models/user';
import { Message } from '../_models/message';
import { Group } from './../_models/group';
// import { Event } from '../_models/event';

import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3080';
const JWT_TOKEN = localStorage.getItem('currentUser');

@Injectable()
export class SocketService {

    private socket;

    public initSocket(): void {
        this.socket = io.connect(SERVER_URL ,
            {'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }}
        );
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public onSuccsess(): Observable<Group> {
        return new Observable<Group>(observer => {
            this.socket.on('success', (data: Group) => observer.next(data));
        });
    }

    public onWorks(): Observable<String> {
        return new Observable<String>(observer => {
            this.socket.on('works', (data: String) => observer.next(data));
        });
    }



    public createChat(name: string, users: User[]): void {
        this.socket.emit('createChat', ({name: name, user: users}));
    }

    public sendMessage(msg: Message): void {
        this.socket.emit('sendMessage', ({
            sender_id : msg.sender_id,
            receiver_id : msg.receiver_id,
            msg : msg.msg,
            sendTime : msg.sendTime
        }));
    }


    /*public onEvent(event: Event): Observable: any {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }*/
}
