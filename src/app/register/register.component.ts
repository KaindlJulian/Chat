import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/users.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {}

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

  register() {
    this.authenticationService.register(model.name, model.email, model.username, model.password)
    .subscribe(result => {
        if (result === true) {
            // succesfull register
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/']);
        }
    });
  }

}
