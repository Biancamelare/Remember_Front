import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private alertaSubject = new Subject<any>();

  constructor() { }

  getAlerta(): Observable<any> {
    return this.alertaSubject.asObservable();
  }

  exibirAlerta(tipo: string, mensagem: string): void {
    this.alertaSubject.next({ type: tipo, mensagem: mensagem });
  }
}
