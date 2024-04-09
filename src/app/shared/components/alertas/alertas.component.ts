import { Component, ViewChild } from '@angular/core';
import { Alerta } from './model/alerta.model';
import { AlertasService } from './service/alerta.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.css'
})
export class AlertasComponent {
 
}
