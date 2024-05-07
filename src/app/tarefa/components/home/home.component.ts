import { Component, Inject } from '@angular/core';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { DOCUMENT } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService) {
  
      const localStorage = document.defaultView?.localStorage;
      if(localStorage){
        this.currentUser = localStorage.getItem('user_logged.token')
        this.currentUserId = localStorage.getItem('user_logged.id')
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

}
