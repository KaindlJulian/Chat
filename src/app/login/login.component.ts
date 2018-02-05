import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/users.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = new User();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  login() {
    if (!this.validate()) {
        return null;
    }
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

    private validate(): boolean {
        if (this.model.username === '') {
            this.model.username = 'Enter a username!';
            return false;
        }
        if (this.model.password === '') {
            this.model.username = 'Enter a password!';
            return false;
        }
        return true;
    }
}
