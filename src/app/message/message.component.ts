import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../_models/message';
import { User } from '../_models/user';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
