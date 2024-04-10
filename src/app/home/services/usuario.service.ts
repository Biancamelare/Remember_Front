import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioLoginModel } from '../models/login.model';
import { UsuarioModel } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getById(id: number) {
    return this.http.get<UsuarioModel>(`http://localhost:3000/usuario/${id}`);
  }

  cadastrarUsuario(usuario: UsuarioModel): Observable<any> {
    return this.http.post(`http://localhost:3000/usuario`, usuario);
  }

  login(usuario: UsuarioLoginModel) {
    try {
      return this.http.post(`http://localhost:3000/auth/login`, { email: usuario.email, password: usuario.senha }).subscribe((response) => {
      });
    } catch (error) {
      return error
    }
  }

  deletar(id: number) {
    return this.http.delete<UsuarioModel>(`http://localhost:3000/${id}`);
  }

}
