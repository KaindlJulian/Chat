import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../_models/message';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  sender: String;
  text: String;
  sendDate: Date;

  constructor() { }

  ngOnInit() {
    this.sender = this.message.sender.name;
    this.text = this.message.msg;
    this.sendDate = this.message.sendTime;
  }

}
