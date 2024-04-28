import { Component, OnInit, ViewChild } from '@angular/core';
import { Alerta } from './model/alerta.model';
import { AlertaService } from './service/alerta.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.css'
})
export class AlertasComponent{
  alerta: any = {};
  isAlertVisible: boolean = false;
  private alertaSubscription: Subscription;

  constructor(private alertaService: AlertaService) {
    this.alertaSubscription = this.alertaService.getAlerta().subscribe(alerta => {
      this.alerta = alerta;
      this.mostrarAlerta();
    });
  }

  mostrarAlerta(): void {
    this.isAlertVisible = true;
    setTimeout(() => {
      this.fecharAlerta();
    }, 5000); 
  }

  fecharAlerta(): void {
    this.isAlertVisible = false;
  }

  ngOnDestroy(): void {
    this.alertaSubscription.unsubscribe();
  }
  

}
