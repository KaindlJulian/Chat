import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../_models/group';
import { User } from '../_models/user';
import { GroupService } from '../_services/group.service';
import { SocketService } from '../_services/socket.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  group: Group;
  users: User[] = [];
  selectedUsers: User[] = [];

  constructor(
    private socketService: SocketService,
    private groupService: GroupService,
    private router: Router) { }

  ngOnInit() {
    this.group = this.groupService.getGroupToAdd();
    this.users = this.groupService.getUsers();
  }

  isSelected(user: User): boolean {
    return !this.selectedUsers.includes(user);
  }

  addUser(user): void {
    this.selectedUsers.push(user);
    this.socketService.addUser(this.group, user);
  }
}
