import { Injectable } from '@angular/core';
import { Group } from '../_models/group';
import { User } from '../_models/user';


@Injectable()
export class GroupService {

  private group: Group;
  private groupToAdd: Group;

  private users = new Array<User>();

  constructor() { }

  public getGroup(): Group {
    this.group = JSON.parse(localStorage.getItem('group'));
    return this.group;
  }
  public setGroup(group: Group): void {
    this.group = group;
    localStorage.setItem('group', JSON.stringify(group));
  }

  public getUserById(id: number): User {
    this.getUsers();
    for (const user of this.users){
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  public getUsers(): User[] {
    this.users = JSON.parse(localStorage.getItem('users'));
    return this.users;
  }
  public setUsers(users: User[]): void {
    this.users = users;
    localStorage.setItem('users', JSON.stringify(users));
  }
}
