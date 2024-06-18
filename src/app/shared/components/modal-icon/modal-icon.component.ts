import { Component, Inject, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CoresService } from '../../services/cores.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { AlertaService } from '../alertas/service/alerta.service';
import { ConfirmacaoService } from '../confirm/service/confirm.service';
import { PageAvatarModel } from '../../models/pageAvatar.model';
import { AvatarModel } from '../../models/avatar.model';
import { AlertasComponent } from '../alertas/alertas.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-modal-icon',
  standalone: true,
  imports: [AlertasComponent, CommonModule, SidenavComponent],
  templateUrl: './modal-icon.component.html',
  styleUrl: './modal-icon.component.css'
})
export class ModalIconComponent implements OnInit {

  currentUser: any;
  currentUserId : any;

  stringBase64: any;
  id_avatar?:number;
  quantAvatares?:number;

  idAvatarSelecionado ?: number;

  avatarPage?:PageAvatarModel
  avatar: AvatarModel[] = [];
  avatares?: AvatarModel[]

  numDivs?: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private coresService: CoresService,
    private usuarioSerive : UsuarioService,
    private alertaService:AlertaService,
    private confirmacaoService: ConfirmacaoService) {
  
      const sessionStorage = document.defaultView?.sessionStorage;
      if(sessionStorage){
        this.currentUser = sessionStorage.getItem('user_logged.token')
        this.currentUserId = sessionStorage.getItem('user_logged.id')
        authService.setToken(this.currentUser)
      }
    }

  ngOnInit(): void {
   
    this.buscarAvatares()
  }

  buscarAvatares(): void {
    this.coresService.buscarImagensPorUsuario(this.currentUser).subscribe(
      (avatares: PageAvatarModel) => {
        this.avatares = avatares.data || [];
        this.quantAvatares = avatares.total;
        this.numDivs = 15 - this.quantAvatares;
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao buscar tarefas: ' + error.error.message);
      }
    );
  }

  selectAvatar(id: number): void {
    this.idAvatarSelecionado = id;
  }

  async salvarAvatar(){
    if(this.idAvatarSelecionado){
        this.usuarioSerive.editarAvatar(this.idAvatarSelecionado, this.currentUserId, this.currentUser).subscribe(
          response => {
            this.alertaService.exibirAlerta('success', 'Avatar alterado com sucesso!');
            window.location.reload();
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao alterar o avatar: ' + error.error.message); 
          })
  }}

  
  openModal() {
    const modalDiv = document.getElementById('modalIcon');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {
    const modalDiv = document.getElementById('modalIcon');
    if(modalDiv!= null) {
      modalDiv.style.display = 'none';
    }
  }
}
