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
  groupMemberNames: string = '';
  groupMembers: User[] = new Array<User>();

  constructor(
    private usersSingleton: GroupService,
    private socketService: SocketService) { }

  ngOnInit() {

    this.users = this.usersSingleton.getUsers();

    this.socketService.initSocket();

    this.socketService.onSuccsess().subscribe((data: any) => {
      this.users = data.users;
    });

    this.socketService.onGetUsers().subscribe(users => {
      this.users = users;
    });
  }

  isSelected(contact: User): boolean {
    return !this.groupMembers.includes(contact);
  }

  addContact(contact: User): void {
    console.log(this.users);
    this.groupMembers.push(contact);
    this.groupMemberNames += contact.username + ', ';
  }

  createGroup(): void {
    console.log(this.users);
    this.socketService.createChat(this.groupName, this.groupMembers);
  }
}
