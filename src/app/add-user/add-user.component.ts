import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../_models/group';
import { User } from '../_models/user';
import { GroupService } from '../_services/group.service';
import { SocketService } from '../_services/socket.service';
import { SessionUserService } from '../_services/session-user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  group: Group;
  users: User[] = [];

  constructor(
    private socketService: SocketService,
    private groupService: GroupService,
    private sessionUser: SessionUserService,
    private router: Router) { }

  ngOnInit() {
    this.socketService.initSocket();
    this.group = this.groupService.getGroup();
    this.users = this.groupService.getUsers();
    this.users.splice(this.sessionUser.getUser().id - 1, 1);
  }

  isInGroup(user: User): boolean {
    return true;
  }

  addContact(user: User): void {
    this.socketService.addUser(this.group, user);
  }

  back(): void {
    this.router.navigate(['chat', this.group.name]);
  }
}
