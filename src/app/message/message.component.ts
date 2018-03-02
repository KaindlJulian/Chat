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
  isActUser: boolean;

  constructor(private sessionUser: SessionUserService) {
    this.actUser = this.sessionUser.getUser();
  }

  ngOnInit() {
    if (!this.message.sender) {
      this.message.sender = new User();
      this.message.sender.username = 'unknown';
    }
    if (this.actUser.id === this.message.sender.id) {
      this.message.sender.username = 'You';
      this.isActUser = true;
    } else {
      this.isActUser = false;
    }
    this.message.sender.avatar_url = `${AVATAR_URL}/${this.message.sender.id}.png`;
  }


}
