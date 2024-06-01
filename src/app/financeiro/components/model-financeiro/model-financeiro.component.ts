import { Component } from '@angular/core';

@Component({
  selector: 'app-model-financeiro',
  standalone: true,
  imports: [],
  templateUrl: './model-financeiro.component.html',
  styleUrl: './model-financeiro.component.css'
})
export class ModelFinanceiroComponent {
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
