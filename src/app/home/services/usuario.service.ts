import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioLoginModel } from '../models/login.model';
import { UsuarioModel } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getById(id: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UsuarioModel>(`https://rememberapi.onrender.com/usuario/${id}`, {headers });
  }

  cadastrarUsuario(usuario: UsuarioModel): Observable<any> {
    return this.http.post(`https://rememberapi.onrender.com/usuario`, usuario);
  }

  editarUsuario(usuario: UsuarioModel, id:number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`https://rememberapi.onrender.com/usuario/${id}`, usuario, {headers });
  }

  login(usuario: UsuarioLoginModel) {

    return this.http.post(`https://rememberapi.onrender.com/auth/login`, { email: usuario.email, password: usuario.senha })

  }

  deletar(id: number) {
    return this.http.delete<UsuarioModel>(`http://localhost:3000/${id}`);
  }

}
