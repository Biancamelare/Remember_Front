import { Component, Inject, ViewChild } from '@angular/core';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { ModalComponent } from '../modal/modal.component';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { PageTarefaModel } from '../../models/pageTarefas.model';
import { TarefaModel } from '../../models/tarefa.model';
import { CategoriaModel } from '../../models/categoria.model';
import { PrioridadeModel } from '../../models/prioridade.model';
import { StatusModel } from '../../models/status.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent,  AlertasComponent, CommonModule, SidenavComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe]
})
export class HomeComponent {
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

  tarefaSelecionada: TarefaModel | undefined;

  formTarefas: FormGroup;

  tarefaFiltro?: string;

  dataHoje: Date = new Date();
  quantTarefasHoje?: number;
  fraseQuantTarefas?: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) {
  
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
            this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
            this.xp = this.usuarioSelecionado.xp
            
        })
    }
    buscarTarefas(): void {
      const params: any = {};
      if (this.dataHoje) params.data_vencimento = this.datePipe.transform(this.dataHoje, 'yyyy-MM-dd');

      this.tarefaService.filtrarTarefas(params, this.currentUser).subscribe(
        (tarefas: PageTarefaModel) => {
          this.tarefas = tarefas.data || [];
          this.quantTarefasHoje = tarefas.total;
          this.atualizarFrase();
          this.associarDados();
        },
        (error) => {
          this.alertaService.exibirAlerta('danger', 'Erro ao filtrar tarefas: ' + error.error.message);
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
      console.log(tarefa)
      this.modalComponent.openModal();
    }
  
    recarregarTarefas(): void {
      this.buscarTarefas();
      this.atualizarFrase();
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

    filtrarTarefas() {
      const params: any = {};
      if (this.dataHoje) params.data_vencimento = this.datePipe.transform(this.dataHoje, 'yyyy-MM-dd');
      if (this.tarefaFiltro) params.nome = this.tarefaFiltro;
  
      this.tarefaService.filtrarTarefas(params, this.currentUser).subscribe(
        (tarefas: PageTarefaModel) => {
          this.tarefas = tarefas.data || [];
          this.associarDados();
        },
        (error) => {
          this.alertaService.exibirAlerta('danger', 'Erro ao filtrar tarefas: ' + error.error.message);
        }
      );
    }

    tarefaChange() {
      if (!this.tarefaFiltro) {
        this.limparFiltro('tarefaFiltro');
      }else{
        this.filtrarTarefas()
      }
    }

    limparFiltro(filtro: string) {
      this.tarefaFiltro = undefined;
      this.filtrarTarefas();
    }

    atualizarFrase(){
      if (this.quantTarefasHoje == 0 || this.quantTarefasHoje == null || this.quantTarefasHoje == undefined) {
        this.fraseQuantTarefas = 'Nenhuma tarefa com vencimento para hoje!';
      } else if (this.quantTarefasHoje == 1) {
        this.fraseQuantTarefas = '1 tarefa';
      } else if (this.quantTarefasHoje > 1) {
        this.fraseQuantTarefas = `${this.quantTarefasHoje} tarefas`;
      }
    }
  
  

}
