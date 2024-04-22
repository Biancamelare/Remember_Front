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
    return this.http.get<UsuarioModel>(`http://localhost:3000/usuario/${id}`, {headers });
  }

  cadastrarUsuario(usuario: UsuarioModel): Observable<any> {
    return this.http.post(`http://localhost:3000/usuario`, usuario);
  }

  login(usuario: UsuarioLoginModel) {

    return this.http.post(`https://rememberapi.onrender.com/auth/login`, { email: usuario.email, password: usuario.senha })

  }

  deletar(id: number) {
    return this.http.delete<UsuarioModel>(`http://localhost:3000/${id}`);
  }

}
