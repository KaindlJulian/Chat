import { Component, OnInit } from '@angular/core';
import { GroupService } from './../_services/group.service';
import { SocketService } from './../_services/socket.service';
import { User } from '../_models/user';
import { Group } from '../_models/group';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  users: User[];

  groupName: string;
  groupMembers: User[] = new Array<User>();

  constructor(
    private usersSingeloton: GroupService,
    private socketService: SocketService) { }

  ngOnInit() {
    this.users = this.usersSingeloton.getUsers();

    this.socketService.initSocket();

    this.socketService.onGetUsers().subscribe(users => {
      this.users = users;
    });
  }

  addContact(contact: User): void {
    this.groupMembers.push(contact);
  }

  createGroup(): void {
    this.socketService.createChat(this.groupName, this.groupMembers);
  }
}
