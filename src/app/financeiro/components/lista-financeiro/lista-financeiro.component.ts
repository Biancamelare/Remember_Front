import { Component } from '@angular/core';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-lista-financeiro',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './lista-financeiro.component.html',
  styleUrl: './lista-financeiro.component.css'
})
export class ListaFinanceiroComponent {

}
