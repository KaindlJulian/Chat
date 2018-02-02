import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupItemComponent } from '../group-item/group-item.component';

// models
import { Group } from './../_models/group';
import { Message } from './../_models/message';
import { User } from './../_models/user';

// services
import { SocketService } from './../_services/socket.service';
import { AuthenticationService } from './../_services/users.service';
import { GroupService } from './../_services/group.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  users: User[] = new Array<User>();
  groups: Group[] = new Array<Group>();
  messages: Message[] = new Array<Message>();

  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketService,
    private groupSingleton: GroupService,
    private router: Router) { }

  ngOnInit() {
    console.log('Im the init user-page');
    this.socketService.initSocket();

    this.socketService.onSuccsess()
      .subscribe((data: any) => {
        console.log(data);
        this.groups = data.groups;
        this.users = data.users;
        this.messages = data.msgs[0];
        this.groupSingleton.setUsers(data.users);
      });

    this.socketService.onNewGroup()
      .subscribe((data) => {
        console.log(data);
        this.groups.push(data.group);
        this.messages.push(data.lastMsg);
      });
  }

  public onOpenGroup(selected: Group): void {
    this.groupSingleton.setGroup(selected);
    this.router.navigate(['chat', selected.name]);
    console.log('chat opened: ' + selected);
  }

  public onLeaveGroup(selected: Group): void {
    this.socketService.leaveGroup(selected);
    console.log('chat left: ' + selected);
  }

  public logoutButton(): void {
    this.socketService.disconnect();
    this.authenticationService.logout();
    this.router.navigate(['home']);
    console.log('token in authService: ' + this.authenticationService.token);
    console.log('socket in socketService: ' + this.socketService.socket);
  }
}
