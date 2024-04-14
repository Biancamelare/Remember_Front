import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../shared/services/auth-service.service';

@Component({
  selector: 'app-visualizar-tarefas',
  standalone: true,
  imports: [],
  templateUrl: './visualizar-tarefas.component.html',
  styleUrl: './visualizar-tarefas.component.css'
})
export class VisualizarTarefasComponent implements OnInit{

  currentUser: any;

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.isLoggedIn();
    console.log(this.currentUser)
  }
}
