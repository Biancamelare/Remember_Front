import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../home/models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarefaServiceService {

  constructor(private http: HttpClient) { }

  getById(id: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UsuarioModel>(`https://rememberapi.onrender.com/usuario/${id}`, {headers });
  }

  cadastrarTarefa(usuario: UsuarioModel): Observable<any> {
    return this.http.post(`https://rememberapi.onrender.com/usuario`, usuario);
  }
}
