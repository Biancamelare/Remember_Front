import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

 token?: string;
 user: any | null = null;
 currentUser: any;
 currentUserId : any;


  constructor(private http: HttpClient,
  @Inject(DOCUMENT) private document: Document,
  ) {
    const sessionStorage = document.defaultView?.sessionStorage;

   }

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

  logout(){
    if(sessionStorage){
      this.currentUser = undefined
      this.currentUserId = undefined
      this.token = undefined
      sessionStorage.removeItem('user_logged.token')
      sessionStorage.removeItem('user_logged.id')
      sessionStorage.removeItem('user_logged')
    } 
  }

 

}
