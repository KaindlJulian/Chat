import { Injectable } from '@angular/core';
import { User } from './../_models/user';

@Injectable()
export class SessionUserService {

  private user: User;

  constructor() { }

  public getUser(): User {
    if (!localStorage.getItem('currentUser')) {
      return null;
    }
    return this.user;
  }

  public setUser(user: User): void {
    if (user) {
      return null;
    }
    this.user = user;
  }
}
