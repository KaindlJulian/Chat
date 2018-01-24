import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../_services/socket.service';
import { Message } from '../_models/message';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Message[];
  ioMsgConnection: any;
  ioSysMsgConnection: any;
  sysMsg: String;

  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit() {
    this.socketService.initSocket();
    console.log(this.socketService)
    this.ioMsgConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.ioSysMsgConnection = this.socketService.onLeftRoom()   // add as msg
      .subscribe((sysMessage: String) => {
        this.sysMsg = sysMessage;
      });
  }

  public sendMessage(message: Message): void {
    if (!message) {
      return;                                                   // abbruch bei leerer msg
    }
    this.socketService.sendMessage(message);
  }



}
