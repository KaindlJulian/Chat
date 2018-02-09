import { Injectable } from '@angular/core';
import { User } from './../_models/user';

@Injectable()
export class SessionUserService {

  private user: User;

  constructor() { }

  public getUser(): User {
    this.user = JSON.parse(localStorage.getItem('sessionUser'));
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
    localStorage.setItem('sessionUser', JSON.stringify(user));
    console.log(user);
  }
}
