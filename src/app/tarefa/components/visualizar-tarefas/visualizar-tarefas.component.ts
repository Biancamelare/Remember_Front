import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
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
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-visualizar-tarefas',
  standalone: true,
  imports: [ModalComponent,  AlertasComponent, CommonModule, SidenavComponent, ReactiveFormsModule, FormsModule],
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
  xp?: number;

  tarefaPage?:PageTarefaModel
  tarefa: TarefaModel[] = [];
  tarefas?: TarefaModel[]

  categorias: CategoriaModel[] = [] as CategoriaModel[];
  categoria: CategoriaModel[] = [];
  categoriaId?: number;

  prioridades: PrioridadeModel[] = [] as PrioridadeModel[];
  prioridade: PrioridadeModel[] = [];

  statusList: StatusModel[] = [] as StatusModel[];
  status: StatusModel[] = [];

  formTarefas: FormGroup;



  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private tarefaService: TarefaServiceService,
    private formBuilder: FormBuilder,
    private alertaService:AlertaService,
) {
  
      const sessionStorage = document.defaultView?.sessionStorage;
      if(sessionStorage){
        this.currentUser = sessionStorage.getItem('user_logged.token')
        this.currentUserId = sessionStorage.getItem('user_logged.id')
        authService.setToken(this.currentUser)
      }
      this.formTarefas = this.formBuilder.group({
        status: [{ value: '', disabled: false}, [Validators.required]],
      });
    
    }

      
  ngOnInit(): void {
    this.buscarUsuario();
    this.buscarTarefas()
    this.listarStatus()
    this.listarPrioridade();
    this.listarCategoria();

   }


  buscarUsuario(){
        this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
          (usuario : UsuarioModel) => {
            this.usuarioSelecionado = usuario;
            this.xp = this.usuarioSelecionado.xp
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
        this.tarefas = tarefas.data || [];
        console.log(this.tarefas)
        this.associarDados();
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao buscar tarefas: ' + error.error.message);
      }
    );
  }

  associarDados(): void {
    if (this.tarefas && this.categorias && this.prioridades && this.statusList) {
      this.tarefas.forEach(tarefa => {
        const categoria = this.categorias.find(c => c.id === tarefa.id_categoria);
        if (categoria) {
          tarefa.nome_categoria = categoria.nome;
        }
  
        const prioridade = this.prioridades.find(p => p.id === tarefa.id_prioridade);
        if (prioridade) {
          tarefa.nome_prioridade = prioridade.nome;
        }

      });
    }
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

  onChangeStatus(event: any, tarefa: TarefaModel): void {
    const novoStatusId = event.target.value;  
    this.editarTarefa(tarefa, novoStatusId); 
  }

  onChangeCheckbox(event: any, tarefa: TarefaModel): void {
    const novoStatusId = event.target.checked ? '4' : '1'; 

    this.editarTarefa(tarefa, novoStatusId); 
  }

  editarTarefa(tarefa: TarefaModel, novoStatusId: string){
    this.tarefaService.editarStatus(tarefa.id, Number(novoStatusId), this.currentUser)
    .subscribe(
      (response) => {
        this.buscarTarefas(); 
      },
      (error) => {
        console.error('Erro ao editar a tarefa:', error);
        this.alertaService.exibirAlerta('danger', 'Erro ao editar a tarefa: ' + error.error.message);
      }
    );
  }
}
