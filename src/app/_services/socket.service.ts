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



const SERVER_URL = 'ws://localhost:3000';

@Injectable()
export class SocketService {

    private socket;
    JWT_TOKEN = localStorage.getItem('currentUser');


    // TODO https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
    // der shit bringt nur wos für msgs weil man des on und emit dann in an service machn kann
    // wenn ma nur an listener braucht is des gay weil ma ka rx subject ohne observer mochn ko

    public initSocket(): void {

        console.log(io);
        this.socket = io.connect('ws://localhost:3000', {
            'extraHeaders': { Authorization: 'Bearer ' + this.JWT_TOKEN }
          });
        console.log('connected to socket: ' + this.socket);
        console.log('jwt token: ' + this.JWT_TOKEN);
    }

    public disconnect(): void {
        this.socket.disconnect();
        console.log('disconnected from socket' + SERVER_URL);
    }

    // region socket on
    public onSuccsess(): Observable<any> {
        return new Observable<any>(observer => {
            console.log(this.socket);
            this.socket.on('success', (data) => {
                console.log('succsees event fired');
                observer.next({groups : data.groups, users: data.users, msgs : data.msgs});
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
            this.socket.on('receiveMessage', (data: Message) => observer.next(data));
        });
    }

    public onSendMessages(): Observable<Message[]> {
        return new Observable<Message[]>(observer => {
            this.socket.on('sendMessages', (data: Message[]) => observer.next(data));
        });
    }

    public onLeftRoom(): Observable<String> {
        return new Observable<String>(observer => {
            this.socket.on('userLeftRoom', (data: String) => observer.next(data));
        });
    }

    public onUserConnectedRoom(): Observable<String> {
        return new Observable<String>(observer => {
            this.socket.on('userConnectedRoom', (data: String) => observer.next(data));
        });
    }
    // endregion

    // region socket emit
        public addUser(group: Group, user: User): void {
            this.socket.emit('addUser', ({
                group: group,
                user: user
            }));
        }

        public createChat(group: Group): void {
            this.socket.emit('createChat', ({
                name: group.name,
                users: group.users
            }));
        }

        public sendMessage(msg: Message): void {
            this.socket.emit('sendMessage', ({
                from: msg.sender,
                msg : msg.msg,
                group: msg.group
            }));
        }

        public openChat(group: Group): void {
            this.socket.emit('openChat', ({
                group: group
            }));
        }

        public leaveGroup(group: Group): void {
            this.socket.emit('leaveGroup', ({
                group: group
            }));
        }
    // endregion

    // RxJS Subject for Message connection
    messageConnection(): Rx.Subject<MessageEvent> {

        const observable = new Observable(observe => {
            this.socket.on('message', (data) => {
              console.log('Received message from Websocket Server: ' + data);
              observe.next(data);
            });
            return () => {
              this.socket.disconnect();
            };
        });

        const observer = {
            next: (msg: Message) => {
                this.socket.emit('message', ({
                    from: msg.sender,
                    msg: msg.msg,
                    group: msg.group
                }));
            },
        };

        return Rx.Subject.create(observer, observable);
      }

}
