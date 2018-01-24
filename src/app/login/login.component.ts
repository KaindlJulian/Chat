import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/users.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = new User();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  login() {
    console.log(this.model);
    this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(result => {
            if (result === true) {
                // login successful
                this.router.navigate(['user-page']);
            } else {
                // login failed
                this.router.navigate(['home']);
            }
        });
    }
}
