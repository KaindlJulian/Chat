import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loginButton() {
    this.router.navigate(['login']);
  }

  registerButton() {
    this.router.navigate(['register']);
  }

  userPageButton() {
    this.router.navigate(['user-page']);
  }
}
