import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GroupService } from './../_services/group.service';
import { SocketService } from './../_services/socket.service';
import { SessionUserService } from '../_services/session-user.service';
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
    private router: Router,
    private usersSingleton: GroupService,
    private socketService: SocketService,
    private sessionUser: SessionUserService) { }

  ngOnInit() {
    this.users = this.usersSingleton.getUsers();

    this.socketService.initSocket();

    this.socketService.onSuccsess().subscribe((data: any) => {
      console.log(data.users);
      this.users = data.users;
      // remove sessionUser
      this.users.splice(this.sessionUser.getUser().id - 1, 1);
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

  unselectAll(): void {
    this.groupMembers = new Array<User>();
    this.groupMemberNames = '';
  }

  createGroup(): void {
    if (this.groupMemberNames === '' || this.groupName.length < 1) {
      return null;
    }
    console.log(this.users);
    this.socketService.createChat(this.groupName, this.groupMembers);
    this.router.navigate(['user-page']);
  }
}
