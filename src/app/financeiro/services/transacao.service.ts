import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { TransacaoModel } from "../models/transacao.model";
import { Injectable } from "@angular/core";
import { PageTransacaoModel } from "../models/pageTransacao.model";
import { Observable } from "rxjs";

;
@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(private http: HttpClient) { }

  cadastrarTransacao(transacao: TransacaoModel, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`http://localhost:3000/transactions`, transacao,{headers });
  }

  getTransacoes(token: string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PageTransacaoModel>(`http://localhost:3000/transactions`, {headers });
  }

  filtrarTransacoes(params: any, token: string): Observable<PageTransacaoModel> {
    const headers = { 'Authorization': `Bearer ${token}` };
    let queryParams = new HttpParams();
    for (let key in params) {
      if (params[key]) {
        queryParams = queryParams.append(key, params[key]);
      }
    }
    return this.http.get<PageTransacaoModel>(`http://localhost:3000/transactions`, { headers, params: queryParams });
}
}
