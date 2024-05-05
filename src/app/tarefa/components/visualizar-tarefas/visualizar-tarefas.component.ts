import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { TarefaModel } from '../../models/tarefa.model';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { PageTarefaModel } from '../../models/pageTarefas.model';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { CategoriaModel } from '../../models/categoria.model';
import { PrioridadeModel } from '../../models/prioridade.model';
import { StatusModel } from '../../models/status.model';

@Component({
  selector: 'app-visualizar-tarefas',
  standalone: true,
  imports: [ModalComponent,  AlertasComponent, CommonModule],
  templateUrl: './visualizar-tarefas.component.html',
  styleUrl: './visualizar-tarefas.component.css'
})
export class VisualizarTarefasComponent implements OnInit {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  @Output() tarefaSelecionada = new EventEmitter<any>();
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;

  tarefaPage?:PageTarefaModel
  tarefa: TarefaModel[] = [];
  tarefas?: TarefaModel[]

  categorias: CategoriaModel[] = [] as CategoriaModel[];
  categoria: CategoriaModel[] = [];

  prioridades: PrioridadeModel[] = [] as PrioridadeModel[];
  prioridade: PrioridadeModel[] = [];

  statusList: StatusModel[] = [] as StatusModel[];
  status: StatusModel[] = [];



  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
) {
  
      const sessionStorage = document.defaultView?.sessionStorage;
      if(sessionStorage){
        this.currentUser = sessionStorage.getItem('user_logged.token')
        this.currentUserId = sessionStorage.getItem('user_logged.id')
        authService.setToken(this.currentUser)
      }}

      
  ngOnInit(): void {
    this.buscarUsuario();
    this.buscarTarefas()
    this.listarStatus()
     
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

 buscarTarefas(): void {
    this.tarefaService.getTarefas(this.currentUser).subscribe(
      (tarefas: PageTarefaModel) => {
        this.tarefaPage = tarefas;
        this.tarefas = tarefas.data
      },
      (error) => {
        this.alertaService.exibirAlerta('danger','Erro ao buscar tarefas: ' + error.error.message);
      }
    );
  }

  listarCategoria(){
    this.tarefaService.getCategorias(this.currentUser).subscribe(
      (categorias: CategoriaModel[]) => {this.categorias = categorias;})
  }

  listarPrioridade(){
    this.tarefaService.getPrioridades(this.currentUser).subscribe(
      (prioridades: PrioridadeModel[]) => {this.prioridades = prioridades; })
  }

  listarStatus(){
    this.tarefaService.getStatus(this.currentUser).subscribe(
      (status: StatusModel[]) => {this.statusList = status;})
  }

  selecionarTarefa(tarefa: any) {
    this.tarefaSelecionada.emit(tarefa);
  }

  recarregarTarefas(): void {
    this.buscarTarefas();
  }
}
