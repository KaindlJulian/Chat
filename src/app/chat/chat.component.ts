import { SocketService } from './../_services/socket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../_services/message.service';
import { GroupService } from '../_services/group.service';
import { Message } from '../_models/message';
import { Group } from '../_models/group';
import { User } from '../_models/user';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages = new Array<Message>();
  group: Group;
  ioMsgConnection: any;
  ioSysMsgConnection: any;
  sysMsg: String;

  msgText: string = '';

  constructor(
    private msgService: MessageService,
    private socketService: SocketService,
    private groupSingleton: GroupService,
    private router: Router) { }


  // https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
  ngOnInit() {
    this.group = this.groupSingleton.getGroup();

    this.initSocket();

    this.ioSysMsgConnection = this.socketService.onLeftRoom()
      .subscribe((sysMessage: String) => {
        this.sysMsg = sysMessage;
        console.log(sysMessage);
      });

    this.ioSysMsgConnection = this.socketService.onGroupJoin()
      .subscribe(data => {
        this.sysMsg = data.group;
      });
  }

  private initSocket(): void {
    this.socketService.initSocket();
    this.socketService.openChat(this.group);

    this.socketService.onSendMessages().subscribe(msgs => {
      console.log(msgs);
      if (this.messages.length !== msgs.length) {
        this.messages = msgs;
        console.log(msgs);
      } else {
        console.log('no new messages');
      }
    });

    this.msgService.messages.subscribe(msg => {
      this.messages.push(msg);
      console.log(msg);
    });
    console.log(this.socketService.socket);
  }

  public sendButton(): void {
    let msg: Message = new Message();
    msg.sender_id = 0; // yea
    msg.msg = this.msgText;
    msg.receiver_id = this.group.id;
    msg.sendTime = new Date();
    this.messages.push(msg);
    this.sendMessage(msg);
  }

  public sendMessage(message: Message): void {
    if (!message) {
      return;
    }
    this.msgService.sendMsg(message);
    this.msgText = '';
  }

  public getUserByMsg(msg: Message): User {
    return this.groupSingleton.getUserById(msg.sender_id);
  }
}
