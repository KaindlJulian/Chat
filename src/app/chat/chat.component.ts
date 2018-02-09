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

  msgText = '';

  currentUser =  new User();
  messages = new Array<Message>();
  group: Group;

  constructor(
    private socketService: SocketService,
    private groupService: GroupService,
    private sessionUser: SessionUserService,
    private router: Router) { }

  ngOnInit() {
    this.group = this.groupService.getGroup();
    console.log(this.sessionUser);
    this.currentUser = this.sessionUser.getUser();

    this.initSocket();
  }

  // tslint:disable-next-line:use-life-cycle-interface
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
      }
    });

    this.socketService.onMessage().subscribe(msg => {
      console.log(msg);
      this.messages.push(this.setSender(msg));
    });

    this.socketService.onLeftRoom()
    .subscribe((sysMessage: String) => {
      console.log(sysMessage);
      const systemMsg: Message = new Message();
      systemMsg.msg = '[' + sysMessage + ']';
      systemMsg.sender = this.sessionUser.getUser();
      this.messages.push(systemMsg);
    });
  }

  public sendButton(): void {
    const msg: Message = new Message();
      msg.sender_id = this.currentUser.id;
      msg.sender = this.currentUser;
      msg.msg = this.msgText;
      msg.receiver_id = this.group.id;
      msg.sendTime = new Date();
    console.log(msg);
    this.sendMessage(msg);
  }

  public sendMessage(message: Message): void {
    if (message.msg === '') {
      return;
    }
    this.messages.push(message);
    this.socketService.sendMessage(message);
    this.msgText = '';
  }

  private setSenderArray(msgs: Message[]): Message[] {
    const mappedMsgs: Message[] = [];
    msgs.forEach((msg, index) => {
      msg.sender = this.groupService.getUserById(msg.sender_id);
      mappedMsgs.push(msg);
    });
    return mappedMsgs.reverse();
  }
  private setSender(message: Message): Message {
    console.log(message);
    const msg: Message = message;
    msg.sender = this.groupService.getUserById(message.sender_id);
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
}
