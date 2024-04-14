import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private token: string | null = null;
  private user: any | null = null;

  constructor(private http: HttpClient) { }

  setToken(token: string) {
    this.token = token;
    console.log("Entrei")
    console.log(token)
    this.decodeToken();
  }

  decodeToken() {
    if (this.token) {
      const payload = this.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      this.user = decodedPayload.usuario;
    }
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.token;
  }

}
