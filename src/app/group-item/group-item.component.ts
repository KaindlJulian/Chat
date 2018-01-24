import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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

  @Output() openGroup: EventEmitter<Group> = new EventEmitter();
  @Output() leaveGroup: EventEmitter<Group> = new EventEmitter();

  ngOnInit() {
    console.log(this.lastMsg);
  }

  openGroupButton(): void {
    this.openGroup.emit(this.group);
  }

  leaveGroupButton(): void {
    this.leaveGroup.emit(this.group);
  }
}
