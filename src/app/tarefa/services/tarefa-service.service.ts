import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../home/models/usuario.model';
import { Observable } from 'rxjs';
import { TarefaModel } from '../models/tarefa.model';
import { CategoriaModel } from '../models/categoria.model';
import { StatusModel } from '../models/status.model';
import { PrioridadeModel } from '../models/prioridade.model';
import { PageTarefaModel } from '../models/pageTarefas.model';
import { ListaTarefa } from '../models/listaTarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaServiceService {

  constructor(private http: HttpClient) { }

  getTarefaById(id: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<TarefaModel>(`http://localhost:3000/tarefas/${id}`, {headers });
  }

  cadastrarTarefa(tarefa: TarefaModel, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`http://localhost:3000/tarefas`, tarefa,{headers });
  }

  editarStatus(id:number, status:number, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`http://localhost:3000/tarefas/${id}`, {id_status: status},{headers });
  }

  
  editarTarefa(id:number, tarefa: TarefaModel, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`http://localhost:3000/tarefas/${id}`, tarefa, {headers });
  }

  getTarefas(token: string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PageTarefaModel>(`http://localhost:3000/tarefas`, {headers });
  }

  getCategorias(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CategoriaModel[]>(`http://localhost:3000/tarefas/categorias`, {headers });
  }
  getStatus(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<StatusModel[]>(`http://localhost:3000/tarefas/status`, {headers });
  }
  getPrioridades(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PrioridadeModel[]>(`http://localhost:3000/tarefas/prioridade`, {headers });
  }

  excluirTarefa(id: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`http://localhost:3000/tarefas/${id}`, {headers });
  }

  
  filtrarTarefas(params: any, token: string): Observable<PageTarefaModel> {
    const headers = { 'Authorization': `Bearer ${token}` };
    let queryParams = new HttpParams();
    for (let key in params) {
      if (params[key]) {
        queryParams = queryParams.append(key, params[key]);
      }
    }
    return this.http.get<PageTarefaModel>(`http://localhost:3000/tarefas`, { headers, params: queryParams });
  }

  editarLista(id:number, lista:ListaTarefa, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`http://localhost:3000/tarefas/item-tarefa/${id}`, lista ,{headers });
  }

  excluirItemLista(id:number,token:string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`http://localhost:3000/tarefas/item-tarefa/${id}`, {headers });
  }

  cadastrarItemLista(lista: ListaTarefa, token:string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`http://localhost:3000/tarefas/lista`, lista,{headers });
  }


}
