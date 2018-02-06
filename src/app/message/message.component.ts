import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { SessionUserService } from '../_services/session-user.service';

const AVATAR_URL = 'https://api.adorable.io/avatars';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  actUser: User;

  // get session to flaot imgs
  constructor(private sessionUser: SessionUserService) {
    this.actUser = this.sessionUser.getUser();
  }

  ngOnInit() {
    if (!this.message.sender) {
      this.message.sender = new User();
      this.message.sender.username = 'unknown';
    }
    this.message.sender.avatar_url = `${AVATAR_URL}/${this.message.sender.id}.png`;
  }

  isNotSessionUser(user: User): boolean {
    return !this.isSessionUser(user);
  }

  isSessionUser(user: User): boolean {
    if (this.actUser.username === user.username) {
      return true;
    }
    return false;
  }
}
