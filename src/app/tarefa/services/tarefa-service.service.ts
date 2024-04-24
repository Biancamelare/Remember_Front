import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../home/models/usuario.model';
import { Observable } from 'rxjs';
import { TarefaModel } from '../models/tarefa.model';
import { CategoriaModel } from '../models/categoria.model';
import { StatusModel } from '../models/status.model';
import { PrioridadeModel } from '../models/prioridade.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaServiceService {

  constructor(private http: HttpClient) { }

  getTarefaById(id: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<TarefaModel>(`https://rememberapi.onrender.com/tarefas/${id}`, {headers });
  }

  cadastrarTarefa(tarefa: TarefaModel, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`https://rememberapi.onrender.com/tarefas`, tarefa,{headers });
  }

  getCategorias(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CategoriaModel[]>(`https://rememberapi.onrender.com/tarefas/categorias`, {headers });
  }
  getStatus(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<StatusModel[]>(`https://rememberapi.onrender.com/tarefas/status`, {headers });
  }
  getPrioridades(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PrioridadeModel[]>(`https://rememberapi.onrender.com/tarefas/prioridade`, {headers });
  }
}
