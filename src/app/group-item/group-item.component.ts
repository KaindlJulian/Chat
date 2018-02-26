import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Group } from '../_models/group';
import { Message } from '../_models/message';

const AVATAR_URL = 'https://api.adorable.io/avatars';

@Component({
  selector: 'group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {

  constructor() { }

  @Input() group: Group;

  @Output() openGroup: EventEmitter<Group> = new EventEmitter();
  @Output() leaveGroup: EventEmitter<Group> = new EventEmitter();

  ngOnInit() {
    if (!this.group.lastMessage) {
      this.group.lastMessage = new Message();
      this.group.lastMessage.msg = 'group created';
    }
    if (this.group.lastMessage.msg.length > 13) {
      this.group.lastMessage.msg = this.group.lastMessage.msg.substr(0, 13) + '...';
    }
    this.group.avatar_url = `${AVATAR_URL}/${this.group.id}.png`;
  }

  openGroupButton(): void {
    this.openGroup.emit(this.group);
  }

  leaveGroupButton(): void {
    this.leaveGroup.emit(this.group);
  }
}
