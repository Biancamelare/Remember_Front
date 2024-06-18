import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { AvatarModel } from '../../../shared/models/avatar.model';
import { CoresService } from '../../../shared/services/cores.service';

@Component({
  selector: 'app-lista-financeiro',
  standalone: true,
  imports: [SidenavComponent, ModelFinanceiroComponent, AlertasComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lista-financeiro.component.html',
  styleUrl: './lista-financeiro.component.css',
  providers: [DatePipe]
})
export class ListaFinanceiroComponent implements OnInit {
  @ViewChild(ModelFinanceiroComponent) modalComponent!: ModelFinanceiroComponent;
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;

  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;
  xp?: number;

  transacaoSelecionado: TransacaoModel | undefined;

  transacaoPage?:PageTransacaoModel
  transacao: TransacaoModel[] = [];
  transacoes?: TransacaoModel[]

  entradas: number = 0;
  saidas: number = 0;
  saldoAtual: number = 0;

  vencimento_em: string | undefined = undefined;
  categoriaFiltro: string | undefined = undefined;
  tipoFiltro: string | undefined = undefined;
  transacaoFiltro?: string;

  stringBase64: any;
  id_avatar?:number;
  avatarSelecionado = {} as AvatarModel;

  quantTransacao:number = 0;
  fraseQuantTransacoes?: string;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private transacaoService: TransacaoService,
    private alertaService:AlertaService,
    public datePipe: DatePipe,
    private coresService: CoresService,
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
        this.id_avatar = this.usuarioSelecionado.id_avatar
        this.buscarAvatar()
    })
}

  buscarTransacoes(): void {
    this.transacaoService.getTransacoes(this.currentUser).subscribe(
      (transacoes: PageTransacaoModel) => {
        this.transacoes = transacoes.data || [];
        this.quantTransacao = transacoes.total;
        this.atualizarFrase();
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

  atualizarFrase(){
    if (this.quantTransacao == 0 || this.quantTransacao == null || this.quantTransacao == undefined) {
      this.fraseQuantTransacoes = 'Nenhuma transação financeira cadastrada!';
    } else if (this.quantTransacao == 1) {
      this.fraseQuantTransacoes = '1 transação financeira';
    } else if (this.quantTransacao > 1) {
      this.fraseQuantTransacoes = `${this.quantTransacao} transações financeiras`;
    }
  }

  recarregarTransacoes(): void {
    this.buscarTransacoes();
  }

  selecionarTransacao(transacao: TransacaoModel) { 
    this.transacaoSelecionado = transacao;
    this.modalComponent.configurarFormularioComDadosDaTransacao();
    this.modalComponent.openModal();
  }

  formatarValor(valor: number | undefined, tipo: string | undefined): string {
    const valorFormatado = valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return tipo === 'd' ? `+ ${valorFormatado}` : `- ${valorFormatado}`;
  }

  formatarData(data: string | Date | undefined): string {
    if (!data) {
      return '-';
    }
  
    const dataString = data instanceof Date ? data.toISOString() : data;
    return this.datePipe.transform(dataString, 'dd/MM/yyyy', 'UTC') || '-';
  }
  tirarVirgula(valor: number | undefined){
    const valorFormatado = valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return valorFormatado;
  }

  filtrarTransacao() {
    const params: any = {};
    
    if (this.vencimento_em) {
      const dataAjustada = this.datePipe.transform(this.vencimento_em, 'yyyy-MM-dd', 'UTC');
      params.vencimento_em = dataAjustada;}
    if (this.transacaoFiltro) params.descricao = this.transacaoFiltro;
    if (this.categoriaFiltro) params.categoria = this.categoriaFiltro;
    if (this.tipoFiltro) params.tipo = this.tipoFiltro;
  
    this.transacaoService.filtrarTransacoes(params, this.currentUser).subscribe(
      (transacoes: PageTransacaoModel) => {
        this.transacoes = transacoes.data || [];
        this.quantTransacao = transacoes.total;
        this.calcularTotais();
        this.atualizarFrase();
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao filtrar tarefas: ' + error.error.message);
      }
    );
  }

  limparFiltros() {
    this.vencimento_em = undefined;
    this.transacaoFiltro = undefined;
    this.categoriaFiltro = undefined;
    this.tipoFiltro = undefined
    this.buscarTransacoes();
  }

  limparFiltro(filtro: string) {
    switch (filtro) {
      case 'vencimento_em':
        this.vencimento_em = undefined;
        break;
      case 'transacaoFiltro':
        this.transacaoFiltro = undefined;
        break;
      case 'categoriaFiltro':
        this.categoriaFiltro = undefined;
        break;
      case 'tipoFiltro':
        this.tipoFiltro = undefined;
        break;
    }
    this.filtrarTransacao();
  }

  transacaoChange() {
    if (!this.transacaoFiltro) {
      this.limparFiltro('transacaoFiltro');
    }else{
      this.filtrarTransacao()
    }
  }

  categoriaChange() {
    if (!this.categoriaFiltro) {
      this.limparFiltro('categoriaFiltro');
    }else{
      this.filtrarTransacao()
    }
  }

 dataChange() {
    if (!this.vencimento_em) {
      this.limparFiltro('vencimento_em');
    }else{
      this.filtrarTransacao()
    }
  }

  filtrarPorTipo(tipo: string) {
    if (this.tipoFiltro === tipo) {
      this.tipoFiltro = undefined; // Limpa o filtro se já estiver aplicado
    } else {
      this.tipoFiltro = tipo; // Aplica o filtro
    }
    this.filtrarTransacao();
  }
  
  openModal() {
    const modalDiv = document.getElementById('modalTransacao');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {

  }

  buscarAvatar() {
    if(this.id_avatar){
      this.coresService.getByIdTema(this.id_avatar,this.currentUser).subscribe( 
        (avatar : AvatarModel) => {
          this.avatarSelecionado = avatar;
          this.stringBase64 = 'data:image/jpg;base64,' + avatar.url_foto
      })
    }

  }
}
