import { Inject, Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { UsuarioService } from '../../home/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  currentUser: any;
  currentUserId : any;

  constructor(@Inject(DOCUMENT) private document: Document,
  private authService: AuthServiceService,
  private usuarioSerive : UsuarioService,
  private router: Router) {

    const sessionStorage = document.defaultView?.sessionStorage;
    if(sessionStorage){
      this.currentUser = sessionStorage.getItem('user_logged.token')
      this.currentUserId = sessionStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    } 
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/login']); 
      return false
    }
  }
}
