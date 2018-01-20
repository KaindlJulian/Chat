import { Component, OnInit } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';
import { Router } from '@angular/router';

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

  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit() {
    this.socketService.initSocket();

    this.socketService.onSuccsess()
      .subscribe((groups: any) => {
        this.groups.push(groups);
      });

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  public sendMessage(message: Message): void {
    if (!message) {
      return;         // abbruch bei leerer msg
    }
    this.socketService.sendMessage(message);
  }

  public leaveGroup(): void {
    this.socketService.leaveGroup(this.groups[1]);
  }

  public onOpenGroup(selected: Group) {
    this.router.navigate(['chat', selected.id]);
  }

}
