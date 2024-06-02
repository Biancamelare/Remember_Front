import { Component, Inject, OnInit } from '@angular/core';
import { ModelFinanceiroComponent } from '../model-financeiro/model-financeiro.component';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { DOCUMENT, DatePipe } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { TransacaoService } from '../../services/transacao.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { PageTransacaoModel } from '../../models/pageTransacao.model';
import { TransacaoModel } from '../../models/transacao.model';
import { FuncoesService } from '../../../shared/services/funcoes.service';

@Component({
  selector: 'app-lista-financeiro',
  standalone: true,
  imports: [SidenavComponent, ModelFinanceiroComponent],
  templateUrl: './lista-financeiro.component.html',
  styleUrl: './lista-financeiro.component.css',
  providers: [DatePipe]
})
export class ListaFinanceiroComponent implements OnInit {

  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;
  xp?: number;

  transacaoPage?:PageTransacaoModel
  transacao: TransacaoModel[] = [];
  transacoes?: TransacaoModel[]

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private transacaoService: TransacaoService,
    private alertaService:AlertaService,
    private datePipe: DatePipe,
    private funcoesService: FuncoesService
) {
  
      const sessionStorage = document.defaultView?.sessionStorage;
      if(sessionStorage){
        this.currentUser = sessionStorage.getItem('user_logged.token')
        this.currentUserId = sessionStorage.getItem('user_logged.id')
        authService.setToken(this.currentUser)
      }
    }

      
  ngOnInit(): void {
    this.buscarUsuario();
    this.buscarTransacoes()

   }


   buscarUsuario(){
    this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
      (usuario : UsuarioModel) => {
        this.usuarioSelecionado = usuario;
        this.xp = this.usuarioSelecionado.xp
        this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
    })
}

  buscarTransacoes(): void {
    this.transacaoService.getTransacoes(this.currentUser).subscribe(
      (transacoes: PageTransacaoModel) => {
        this.transacoes = transacoes.data || [];
        console.log(this.transacoes)
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao buscar tarefas: ' + error.error.message);
      }
    );
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
