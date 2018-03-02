import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { JitCompiler } from '@angular/compiler/src/jit/compiler';
import { SessionUserService } from './session-user.service';

const SERVER_URL = 'https://thawing-beach-52197.herokuapp.com';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http, private sessionUser: SessionUserService) {
    }

    register(name: string, email: string, username: string, password: string): Observable<boolean> {
        console.log(JSON.stringify({ name: name, email: email, username: username, password: password }));
        return this.http.post(SERVER_URL + '/users/api/register', {name: name, email: email, username: username, password: password })
            .map((response: Response) => {
                if (response.json().success) {
                    console.log('succesfull register');
                    return true;
                } else {
                    console.log('register failed');
                    return false;
                }
            });
    }

    login(username: string, password: string): Observable<boolean> {
        console.log(JSON.stringify({username: username, password: password}));
        return this.http.post(SERVER_URL + '/users/api/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response.json() && response.json().token;
                console.log(response.json().msg);
                if (token) {
                    this.token = token;
                    localStorage.setItem('currentUser', token );
                    this.sessionUser.setUser(response.json().user);
                    console.log('succesfull login');
                    return true;
                } else {
                    console.log('login failed');
                    return false;
                }
            });
    }

    logout(): void {
        // delete token from localStorage
        this.token = null;
        localStorage.clear();
        console.log('token deleted');
    }
}
