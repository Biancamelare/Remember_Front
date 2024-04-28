import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmacaoService {
  private confirmacaoSubject = new Subject<any>();

  constructor() { }

  getConfirmacao(): Observable<any> {
    return this.confirmacaoSubject.asObservable();
  }

  exibirConfirmacao(mensagem: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmacaoSubject.next({ mensagem, resolve });
    });
  }

}
