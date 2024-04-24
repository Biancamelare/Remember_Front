import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-icon',
  standalone: true,
  imports: [],
  templateUrl: './modal-icon.component.html',
  styleUrl: './modal-icon.component.css'
})
export class ModalIconComponent {
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
