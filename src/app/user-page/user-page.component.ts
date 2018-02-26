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
import { SessionUserService } from '../_services/session-user.service';

const AVATAR_URL = 'https://api.adorable.io/avatars';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;
  users: User[] = new Array<User>();
  groups: Group[] = new Array<Group>();
  messages: Message[] = new Array<Message>();
  showContacts = false;

  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketService,
    private groupService: GroupService,
    private sessionUser: SessionUserService,
    private router: Router) { }

  ngOnInit() {
    this.initUser();
    this.socketService.initSocket();

    this.socketService.onSuccsess()
      .subscribe((data: any) => {
        console.log(data);
        this.groups = data.groups;
        this.users = data.users;
        this.setLastMessages(data.msgs);
        this.groupService.setUsers(data.users);
        this.users.splice(this.sessionUser.getUser().id - 1, 1);
      });

    this.socketService.onMessage()
      .subscribe((data) => {
        this.groups.forEach((group, index) => {
          if (group.id === data.receiver_id) {
            group.lastMessage = data;
          }
        });
      });

    this.socketService.onNewGroup()
      .subscribe((data) => {
        console.log(data);
        const newGroup: Group = data.group;
        newGroup.lastMessage = null;
        newGroup.admin_id = data.admin_id;
        console.log(newGroup);
        this.groups.push(newGroup);
        location.reload(true);
      });
  }

  private initUser(): void {
    const newUser = this.sessionUser.getUser();
    newUser.avatar_url = `${AVATAR_URL}/${newUser.id}.png`;
    this.user = newUser;
    this.sessionUser.setUser(newUser);
  }

  private setLastMessages(messages: Message[]): void {
    this.groups.forEach((group, index) => {
      if (messages[index]) {
        group.lastMessage = messages[index][0];
      }
    });
  }

  toggleShowContacts(): void {
    this.showContacts = !this.showContacts;
  }

  public onOpenGroup(selected: Group): void {
    console.log('selected group: ');
    console.log(selected);
    this.groupService.setGroup(selected);
    this.router.navigate(['chat', selected.name]);
  }
  public onLeaveGroup(selected: Group): void {
    this.groups.splice(this.groups.indexOf(selected), 1);
    this.socketService.leaveGroup(selected);
    console.log('chat left:');
    console.log(selected);
  }

  public logoutButton(): void {
    this.socketService.disconnect();
    this.authenticationService.logout();
    this.router.navigate(['home']);
    console.log('token in authService: ' + this.authenticationService.token);
    console.log('socket in socketService: ' + this.socketService.socket);
  }
}
