import { SocketService } from './../_services/socket.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { GroupService } from '../_services/group.service';
import { SessionUserService } from '../_services/session-user.service';

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

  @ViewChild('room') private myScrollContainer: ElementRef;
  messages = new Array<Message>();
  group: Group;
  ioMsgConnection: any;
  ioSysMsgConnection: any;
  sysMsg: String;

  msgText = '';

  constructor(
    private socketService: SocketService,
    private groupSingleton: GroupService,
    private router: Router) { }


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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private initSocket(): void {
    this.socketService.initSocket();
    this.socketService.openChat(this.group);

    this.socketService.onSendMessages().subscribe(msgs => {
      if (this.messages.length !== msgs.length) {
        this.messages = this.setSenderArray(msgs);
        console.log(msgs);
      } else {
        console.log('no new messages');
      }
    });

    this.socketService.onMessage().subscribe(msg => {
      console.log(msg);
      this.messages.push(this.setSender(msg));
    });
    console.log(this.socketService.socket);
  }

  public sendButton(): void {
    const msg: Message = new Message();

    msg.sender_id = 0; // get id from session user service
    msg.sender = this.groupSingleton.getUserById(msg.sender_id); // get sessionUser from service
    msg.msg = this.msgText;
    msg.receiver_id = this.group.id;
    msg.sendTime = new Date();

    console.log(msg);
    this.messages.push(msg);
    this.sendMessage(msg);
  }

  public sendMessage(message: Message): void {
    if (!message) {
      return;
    }
    this.socketService.sendMessage(message);
    this.msgText = '';
  }

  public getUserByMsg(msg: Message): User {
    return this.groupSingleton.getUserById(msg.sender_id);
  }

  private setSenderArray(msgs: Message[]): Message[] {
    const mappedMsgs: Message[] = [];
    msgs.forEach((msg, index) => {
      mappedMsgs.push(msg);
      mappedMsgs[index].sender = this.groupSingleton.getUserById(msg.sender_id);
    });
    return mappedMsgs.reverse();
  }
  private setSender(message: Message): Message {
    console.log(message);
    const msg: Message = message;
    msg.sender = this.groupSingleton.getUserById(message.sender_id);
    return msg;
  }


  public navigateAdd(): void {
    this.router.navigate(['group-add', this.group.name]);
  }
  public navigateRemove(): void {
    this.router.navigate(['group-remove', this.group.name]);
  }

  public leaveGroup(): void {
    this.socketService.leaveGroup(this.group);
    this.router.navigate(['user-page']);
  }
  public deleteGroup(): void {
    console.log('deleteGroup - wip');
  }
}
