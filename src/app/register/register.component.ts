import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/users.service'
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model = new User();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

  register() {
    if (!this.validate()) {
      return null;
    }
    this.authenticationService.register(this.model.name, this.model.email, this.model.username, this.model.password)
    .subscribe(result => {
        if (result === true) {
            // succesfull register
            this.router.navigate(['login']);
        } else {
            this.router.navigate(['home']);
        }
    });
  }

  private validate(): boolean {
    if (this.model.name === '') {
      this.model.name = 'Enter a name!';
      return false;
    }
    if (this.model.username === '') {
      this.model.username = 'Enter a username!';
      return false;
    }
    if (this.model.email === '') {
      this.model.email = 'Enter a email!';
      return false;
    }
    if (this.model.password === '') {
      this.model.password = 'Enter a password!';
      return false;
    }
    return true;
  }

}
