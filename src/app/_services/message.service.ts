import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from '../_models/message';


@Injectable()
export class MessageService {

  public messages: Subject<Message>;

  // message observer
  constructor(socketService: SocketService) {
    this.messages = <Subject<Message>> socketService
    .messageConnection()
    .map((response: MessageEvent): Message => {
      return response.data;
    });
  }

  // message observable (this.messages)
  sendMsg(msg: Message) {
    console.log('new message in msgService: ');
    console.log(msg);
    this.messages.next(msg);
  }

}
