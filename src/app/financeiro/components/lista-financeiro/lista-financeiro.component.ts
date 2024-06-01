import { Component } from '@angular/core';
import { ModelFinanceiroComponent } from '../model-financeiro/model-financeiro.component';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-lista-financeiro',
  standalone: true,
  imports: [SidenavComponent, ModelFinanceiroComponent],
  templateUrl: './lista-financeiro.component.html',
  styleUrl: './lista-financeiro.component.css'
})
export class ListaFinanceiroComponent {
  
  openModal() {
    const modalDiv = document.getElementById('exampleModal');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {
    const modalDiv = document.getElementById('exampleModal');
    if(modalDiv!= null) {
      modalDiv.style.display = 'none';
    }
  }
}
