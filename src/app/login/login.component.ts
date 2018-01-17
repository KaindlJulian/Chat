import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/users.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

  login() {
    this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(result => {
            if (result === true) {
                // login successful
                this.router.navigate(['user-page']);
            } else {
                // login failed
                this.router.navigate(['/']);
            }
        });
    }
}
