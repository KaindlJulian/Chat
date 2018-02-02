import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @Input() user: User;
  @Output() addContact: EventEmitter<User> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  emitAddContact(): void {
    this.addContact.emit(this.user);
  }
}
