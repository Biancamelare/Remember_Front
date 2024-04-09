import { Injectable, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Alerta } from '../model/alerta.model';


@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  public alertaSubject = new Subject<Alerta>();
  readonly TEMPO_DE_EXIBICAO = 4000;

  constructor() { }

 exibirAlerta(
    alerta: Alerta,
    tipoAlerta: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark',
    mensagem: string
  ): void {

    alerta.type = tipoAlerta;
    alerta.mensagem = mensagem;
    alerta.mostrar = true;

    this.alertaSubject.next(alerta);
  }
}