import { Component, Inject, OnInit } from '@angular/core';
import { ModelFinanceiroComponent } from '../model-financeiro/model-financeiro.component';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { TransacaoService } from '../../services/transacao.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { PageTransacaoModel } from '../../models/pageTransacao.model';
import { TransacaoModel } from '../../models/transacao.model';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-financeiro',
  standalone: true,
  imports: [SidenavComponent, ModelFinanceiroComponent, AlertasComponent, CommonModule, ReactiveFormsModule, FormsModule],
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

  entradas: number = 0;
  saidas: number = 0;
  saldoAtual: number = 0;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private transacaoService: TransacaoService,
    private alertaService:AlertaService,
    public datePipe: DatePipe,
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
        this.calcularTotais();
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao buscar tarefas: ' + error.error.message);
      }
    );
  }

  calcularTotais(): void {
    this.entradas = this.transacoes
      ?.filter(transacao => transacao.tipo === 'd' && transacao.preco !== undefined)
      .reduce((sum, transacao) => sum + (transacao.preco || 0), 0) || 0;
  
    this.saidas = this.transacoes
      ?.filter(transacao => transacao.tipo === 'c' && transacao.preco !== undefined)
      .reduce((sum, transacao) => sum + (transacao.preco || 0), 0) || 0;
  
    this.saldoAtual = this.entradas - this.saidas;
  }


  recarregarTransacoes(): void {
    this.buscarTransacoes();
  }

  formatarValor(valor: number | undefined, tipo: string | undefined): string {
    const valorFormatado = valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return tipo === 'd' ? `+ ${valorFormatado}` : `- ${valorFormatado}`;
  }

  tirarVirgula(valor: number | undefined){
    const valorFormatado = valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return valorFormatado;
  }
  
  openModal() {
    const modalDiv = document.getElementById('modalTransacao');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {

  }
}
