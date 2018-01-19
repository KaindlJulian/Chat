import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { JitCompiler } from '@angular/compiler/src/jit/compiler';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    register(name: string, email: string, username: string, password: string): Observable<boolean> {
        console.log(JSON.stringify({ name: name, email: email, username: username, password: password }));
        return this.http.post(SERVER_URL + '/users/register', {name: name, email: email, username: username, password: password })
            .map((response: Response) => {
                if (response.json().success) {
                    console.log('succesfull register');
                    return true;    // succesfull register
                } else {
                    console.log('register failed');
                    return false;   // register failed
                }
            });
    }

    login(username: string, password: string): Observable<boolean> {
        console.log(JSON.stringify({username: username, password: password}));
        return this.http.post(SERVER_URL + '/users/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response.json() && response.json().token;
                if (token) {
                    this.token = token;
                    console.log('token received: ' + token);

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    console.log('succesfull login');
                    return true;    // succesfull login
                } else {
                    console.log('login failed');
                    return false;   // login failed
                }
            });
    }

    logout(): void {
        // delete token from localStorage
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
