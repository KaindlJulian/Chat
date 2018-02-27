import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';
// tslint:disable-next-line:import-blacklist
import * as Rx from 'rxjs/Rx';

// models
import { User } from '../_models/user';
import { Message } from '../_models/message';
import { Group } from './../_models/group';
// import { Event } from '../_models/event';



const SERVER_URL = 'ws://localhost:3462';

@Injectable()
export class SocketService {
    public socket;

    JWT_TOKEN = localStorage.getItem('currentUser');
    opts = {
        extraHeaders: { Authorization: 'Bearer ' + this.JWT_TOKEN }
    };

    public initSocket(): void {
        this.socket = io(SERVER_URL, {
                'query': 'token=' + this.JWT_TOKEN
        });
        console.log(this.socket);
    }

    public disconnect(): void {
        this.socket.disconnect();
        console.log('disconnected from socket on' + SERVER_URL);
    }

    // region SOCKET ON
        public onSuccsess(): Observable<any> {
            return new Observable<any>(observer => {
                this.socket.on('success', (data) => {
                    console.log(data);
                    observer.next({groups: data.groups, users: data.users, msgs: data.msgs});
                });
            });
        }

        public onGetUsers(): Observable<User[]> {
            return new Observable<User[]>(observer => {
                this.socket.on('getUsers', (data: User[]) => observer.next(data));
            });
        }

        public onMessage(): Observable<Message> {
            return new Observable<Message>(observer => {
                this.socket.on('receiveMessage', (data: Message) => {
                    console.log(data);
                    observer.next(data);
                });
            });
        }

        public onSendMessages(): Observable<Message[]> {
            return new Observable<Message[]>(observer => {
                this.socket.on('sendMessages', (data: any) => observer.next(data.msgs));
            });
        }

        public onLeftRoom(): Observable<String> {
            return new Observable<String>(observer => {
                this.socket.on('userLeftRoom', (data: String) => {
                    observer.next(data);
                    console.log('data');
                });
            });
        }

        public onUserConnectedRoom(): Observable<String> {
            return new Observable<String>(observer => {
                this.socket.on('userConnectedRoom', (data: String) => observer.next(data));
            });
        }

        public onGroupJoin(): Observable<any> {
            return new Observable<any>(observer => {
                this.socket.on('groupJoin', (data) => observer.next(data));
            });
        }

        public onNewGroup(): Observable<any> {
            return new Observable<any>(observer => {
                this.socket.on('newGroup', (data) => {
                    console.log(data);
                    observer.next({group: data.group, lastMsg: data.lastmsg, admin_id: data.group.creator});
                });
            });
        }
    // endregion

    // region SOCKET EMIT
        public addUser(group: Group, user: User): void {
            this.socket.emit('addUser', ({
                group: group,
                user: user
            }));
            console.log('emit addUser');
            console.log(group, user);
        }

        public createChat(groupName: String, users: User[]): void {
            this.socket.emit('createChat', ({
                name: groupName,
                users: users
            }));
        }

        public sendMessage(msg: Message): void {
            this.socket.emit('sendMessage', ({
                msg : msg.msg,
                group: msg.receiver_id
            }));
        }

        public openChat(group: Group): void {
            console.log(this.socket);
            this.socket.emit('openChat', ({
                group: group
            }));
        }

        public leaveGroup(group: Group): void {
            this.socket.emit('leaveRoom', ({
                group: group
            }));
            console.log('leaveGroup emit');
            console.log(group);
        }
    // endregion
}
