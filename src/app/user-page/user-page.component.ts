import { Component, OnInit } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';

// models
import { Group } from './../_models/group';
import { Message } from './../_models/message';
import { User } from './../_models/user';

// services
import { SocketService } from './../_services/socket.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  ioConnection: any;  // io connection for msgs

  user: User;
  groups: Group[];
  messages: Message[];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;         // abbruch bei leerer msg
    }

    this.socketService.sendMessage({
      sender_id: this.user.username,      //username?
      receiver_id: this.groups[2].users,  //list of users/groupname
      msg: message,
      sendTime: new Date()
    });
  }

}
