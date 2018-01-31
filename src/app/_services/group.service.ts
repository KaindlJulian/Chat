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

  public getUserById(id: number): User {
    console.log(this.users);
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
