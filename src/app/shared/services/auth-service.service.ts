import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

 token?: string;
 user: any | null = null;


  constructor(private http: HttpClient) { }

  setToken(token: string) {
    this.token = token;
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

  getToken(){
    return this.token;
  }

  isLoggedIn() {
    return !!this.token;
  }

}
