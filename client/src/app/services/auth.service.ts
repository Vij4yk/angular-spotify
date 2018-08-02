import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) {}

  // Registers new users.
  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:8080/users/register', user, { headers: headers })
      .pipe(map(res => res));
  }

  // Authenticates users at login
  authenticateUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('users/authenticate', user, { headers: headers })
      .pipe(map(res => res));
  }

  // Gets a users profile information when authenticated
  getProfile() {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http
      .get('http://localhost:8080/users/profile', { headers: headers })
      .pipe(map(res => res));
  }

  // Sets auth data at login
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // Gets an auth token
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // Checks if a user is authed
  loggedIn() {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(this.authToken);
    console.log(isExpired);
  }

  // Removes auth token, clears localStorage
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
