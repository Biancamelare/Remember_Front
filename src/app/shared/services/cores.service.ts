import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CoresModel } from "../models/cores.model";
import { AvatarModel } from "../models/avatar.model";
import { PageAvatarModel } from "../models/pageAvatar.model";

@Injectable({
    providedIn: 'root'
  })
  export class CoresService {
  

    constructor(private http: HttpClient) { }

    getById(id: number) {
     return this.http.get<CoresModel>(`http://localhost:3000/usuario/temas/${id}`);
    }

    getByIdTema(id: number, token:string){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
        return this.http.get<AvatarModel>(`http://localhost:3000/avatar/${id}`, {headers });
    }

    buscarImagensPorUsuario(token:string){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<PageAvatarModel>(`http://localhost:3000/avatar`, {headers });
    }

    buscarImagens(){
      return this.http.get<PageAvatarModel>(`http://localhost:3000/avatar/todos`);
    }
  
   
  }
  