import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getById(id: number) {
    return this.http.get<UsuarioModel>(`http://localhost:3000/${id}`);
  }
  
  salvar(usuario: UsuarioModel) {
    if (usuario.id) {
      return this.http.put<UsuarioModel>(`http://localhost:3000`, usuario);
    } else {
      return this.http.post<UsuarioModel>(`http://localhost:3000`, usuario);
    }
  }

  deletar(id: number) {
    return this.http.delete<UsuarioModel>(`http://localhost:3000/${id}`);
  }

}
