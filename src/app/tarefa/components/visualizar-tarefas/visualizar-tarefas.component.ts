import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
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
import { AvatarModel } from '../../../shared/models/avatar.model';
import { CoresService } from '../../../shared/services/cores.service';

@Component({
  selector: 'app-visualizar-tarefas',
  standalone: true,
  imports: [ModalComponent,  AlertasComponent, CommonModule, SidenavComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './visualizar-tarefas.component.html',
  styleUrl: './visualizar-tarefas.component.css',
  providers: [DatePipe]
})
export class VisualizarTarefasComponent implements OnInit {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
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

  tarefaSelecionada: TarefaModel | undefined;

  
  dataInicio: string | undefined = undefined;
  statusFiltro: number | undefined = 0;
  categoriaFiltro: number | undefined = 0;
  prioridadeFiltro: number | undefined = 0;
  tarefaFiltro?: string;

  filtrosAplicados: string = 'Listado por - Sem filtros aplicados.';

  stringBase64: any;
  id_avatar?:number;
  avatarSelecionado = {} as AvatarModel;



  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private tarefaService: TarefaServiceService,
    private formBuilder: FormBuilder,
    private alertaService:AlertaService,
    private coresService: CoresService,
    private datePipe: DatePipe
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
    this.listarStatus()
    this.listarPrioridade();
    this.listarCategoria();
    this.buscarTarefas()
    

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

  selecionarTarefa(tarefa: TarefaModel) { 
    this.tarefaSelecionada = tarefa;
    this.modalComponent.configurarFormularioComDadosDaTarefa();
    this.modalComponent.openModal();
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
        this.buscarUsuario();
      },
      (error) => {
        console.error('Erro ao editar a tarefa:', error);
        this.alertaService.exibirAlerta('danger', 'Erro ao editar a tarefa: ' + error.error.message);
      }
    );
  }


  filtrarTarefas() {
    const params: any = {};
    if (this.dataInicio) params.data_vencimento = this.dataInicio;
    if (this.statusFiltro) params.id_status = this.statusFiltro;
    if (this.categoriaFiltro) params.id_categoria = this.categoriaFiltro;
    if (this.prioridadeFiltro) params.id_prioridade = this.prioridadeFiltro;
    if (this.tarefaFiltro) params.nome = this.tarefaFiltro;

    this.tarefaService.filtrarTarefas(params, this.currentUser).subscribe(
      (tarefas: PageTarefaModel) => {
        this.tarefas = tarefas.data || [];
        this.associarDados();
        this.atualizarFiltrosAplicados();
      },
      (error) => {
        this.alertaService.exibirAlerta('danger', 'Erro ao filtrar tarefas: ' + error.error.message);
      }
    );
  }

  limparFiltros() {
    this.dataInicio = undefined;
    this.statusFiltro = 0;
    this.categoriaFiltro = 0;
    this.prioridadeFiltro = 0;
    this.tarefaFiltro = undefined
    this.buscarTarefas();
    this.filtrosAplicados = 'Listado por - Sem filtros aplicados.'
  }

  limparFiltro(filtro: string) {
    switch (filtro) {
      case 'dataInicio':
        this.dataInicio = undefined;
        break;
      case 'statusFiltro':
        this.statusFiltro = 0;
        break;
      case 'categoriaFiltro':
        this.categoriaFiltro = 0;
        break;
      case 'prioridadeFiltro':
        this.prioridadeFiltro = 0;
        break;
      case 'tarefaFiltro':
        this.tarefaFiltro = undefined;
        break;
    }
    this.atualizarFiltrosAplicados();
    this.filtrarTarefas();
  }

  formatarData(data: string | undefined): string {
    return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
  }

  tarefaChange() {
    if (!this.tarefaFiltro) {
      this.limparFiltro('tarefaFiltro');
    }else{
      this.filtrarTarefas()
    }
  }

  atualizarFiltrosAplicados() {
    const filtros: string[] = [];
    if (this.dataInicio) {
      const dataInicio = this.dataInicio ? this.formatarData(this.dataInicio) : '';
      filtros.push(`Data: ${dataInicio}`);
    }
    if (this.statusFiltro) {
      const status = this.statusList.find(s => s.id === this.statusFiltro)?.nome;
      if (status) filtros.push(`Status: ${status}`);
    }
    if (this.categoriaFiltro) {
      const categoria = this.categorias.find(c => c.id === this.categoriaFiltro)?.nome;
      if (categoria) filtros.push(`Categoria: ${categoria}`);
    }
    if (this.prioridadeFiltro) {
      const prioridade = this.prioridades.find(p => p.id === this.prioridadeFiltro)?.nome;
      if (prioridade) filtros.push(`Prioridade: ${prioridade}`);
    }

    this.filtrosAplicados = `Listado por - ${filtros.join('; ')}`;
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
