import { Component, OnInit } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';

// models
import { Group } from './../_models/group';
import { Message } from './../_models/message';
import { User } from './../_models/user';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: User;
  groups: Group[];

  constructor() { }

  ngOnInit() {
  }


}
 