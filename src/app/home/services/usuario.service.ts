import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioLoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getById(id: number) {
    return this.http.get<UsuarioModel>(`http://localhost:3000/usuario/${id}`);
  }
  
  cadastrarUsuario(usuario: UsuarioModel) {
    /*if (usuario.id) {
      return this.http.put<UsuarioModel>(`http://localhost:3000`, usuario);
    } else {*/
    try{
      console.log("User",usuario)
      return this.http.post(`http://localhost:3000/usuario`,usuario).subscribe((response)=>{
        console.log("Foi")
      });
    }catch (error){
      
      return error
    }
  }

  login(usuario: UsuarioLoginModel) {
    try{
      console.log("User",usuario)
      return this.http.post(`http://localhost:3000/auth/login`,usuario).subscribe((response)=>{
        console.log("Foi")
      });
    }catch (error){
      
      return error
    }
  }

  deletar(id: number) {
    return this.http.delete<UsuarioModel>(`http://localhost:3000/${id}`);
  }

}
