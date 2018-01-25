import { SocketService } from './../_services/socket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../_services/message.service';
import { GroupService } from '../_services/group.service';
import { Message } from '../_models/message';
import { Group } from '../_models/group';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Message[];
  group: Group;
  ioMsgConnection: any;
  ioSysMsgConnection: any;
  sysMsg: String;

  constructor(
    private msgService: MessageService,
    private socketService: SocketService,
    private groupSingleton: GroupService,
    private router: Router) { }


  // https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
  ngOnInit() {
    this.socketService.initSocket();

    console.log(this.socketService);

    this.msgService.messages.subscribe(msg => {
      this.messages.push(msg);
      console.log( msg);
    });

    this.ioSysMsgConnection = this.socketService.onLeftRoom()
      .subscribe((sysMessage: String) => {
        this.sysMsg = sysMessage;
        console.log(sysMessage);
      });
    this.group = this.groupSingleton.getGroup();
  }

  public sendMessage(message: Message): void {
    if (!message) {
      return;
    }
    this.socketService.sendMessage(message);
  }
}
