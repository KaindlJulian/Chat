import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../_models/user';

const AVATAR_URL = 'https://api.adorable.io/avatars';

@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @Input() user: User;
  @Output() addContact: EventEmitter<User> = new EventEmitter<User>();
  constructor() { }

  ngOnInit() {
    if (this.user.username.length >= 9) {
      this.user.username = this.user.username.substr(0, 7) + '...';
    }
    this.user.avatar_url = `${AVATAR_URL}/${this.user.id}.png`;
  }

  emitAddContact(): void {
    this.addContact.emit(this.user);
  }
}
