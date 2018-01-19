import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../_models/group';
import { Message } from '../_models/message';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {

  constructor() { }

  @Input() group: Group;
  @Input() lastMsg: Message;

  ngOnInit() {
  }

}
