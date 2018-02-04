import { Injectable } from '@angular/core';
import { Group } from '../_models/group';
import { User } from '../_models/user';

@Injectable()
export class GroupService {

  private group: Group;

  private users = new Array<User>();

  constructor() { }

  public getGroup(): Group {
    return this.group;
  }

  public setGroup(group: Group): void {
    this.group = group;
  }

 // gibt error bei anzeign der message für den sender weil der ned im array is
 // deswegn moch wa an sender: User ind message und ersparn uns den scheiß, muss dann halt nur mappen
 // (kann i ned weil du ka sender_id beim receiveMessage bigst)
  public getUserById(id: number): User {
    for (let user of this.users){
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  public getUsers(): User[] {
    return this.users;
  }
  public setUsers(users: User[]): void {
    this.users = users;
  }
}
