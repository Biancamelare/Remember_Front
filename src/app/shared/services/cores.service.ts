import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CoresModel } from "../models/cores.model";

@Injectable({
    providedIn: 'root'
  })
  export class CoresService {
  

    constructor(private http: HttpClient) { }

    getById(id: number) {
     return this.http.get<CoresModel>(`http://localhost:3000/usuario/temas/${id}`);
    }
  
   
  }
  