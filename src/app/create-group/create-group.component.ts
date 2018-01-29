import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  

  iconsSelect: Array<any>;

  constructor() { }

  ngOnInit() {
    this.iconsSelect = [
      { value: '1', label: 'Option 1', icon: 'https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg' },
      { value: '2', label: 'Option 2', icon: 'https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg' },
      { value: '3', label: 'Option 3', icon: 'https://mdbootstrap.com/img/Photos/Avatars/avatar-3.jpg' },
  ];
  }

}
