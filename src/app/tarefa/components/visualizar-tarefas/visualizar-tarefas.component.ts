import { Component, Inject } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { DOCUMENT } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { FuncoesService } from '../../../shared/services/funcoes.service';

@Component({
  selector: 'app-visualizar-tarefas',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './visualizar-tarefas.component.html',
  styleUrl: './visualizar-tarefas.component.css'
})
export class VisualizarTarefasComponent {
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService) {
  
      const sessionStorage = document.defaultView?.sessionStorage;
      if(sessionStorage){
        this.currentUser = sessionStorage.getItem('user_logged.token')
        this.currentUserId = sessionStorage.getItem('user_logged.id')
        authService.setToken(this.currentUser)
      }}

      
  ngOnInit(): void {
    this.buscarUsuario();
     
   }

  buscarUsuario(){
        this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
          (usuario : UsuarioModel) => {
            this.usuarioSelecionado = usuario;
            this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
        })
    }

    logout(){
      this.authService.logout();
    }




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
