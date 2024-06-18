import { Component, Inject, ViewChild, importProvidersFrom } from '@angular/core';
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
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { circleProgressOptions } from '../../../shared/models/grafico';
import { ChartCommonModule, NgxChartsModule, PieChartComponent } from '@swimlane/ngx-charts';
import { ChartsModule } from '../../../shared/models/charts.module';
import { CoresService } from '../../../shared/services/cores.service';
import { AvatarModel } from '../../../shared/models/avatar.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent,  AlertasComponent, CommonModule, SidenavComponent, ReactiveFormsModule, FormsModule, NgCircleProgressModule, ChartsModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe,  { provide: CircleProgressOptions, useValue: circleProgressOptions } ]
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
  tarefasAnalise?: TarefaModel[]

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
  fraseTarefasDiarias ?: string;

  totalTarefas: number = 0;
  tarefasConcluidas: number = 0;
  tarefasConcluidasHoje: number = 0;
  progresso: number = 0;
  emProgresso: number = 0;
  aFazer: number = 0;
  atrasadas: number = 0;
  concluida: number = 0;

  chartData: any[] = [];

  stringBase64: any;
  id_avatar?:number;
  avatarSelecionado = {} as AvatarModel;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    private coresService: CoresService,
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
    this.dataHoje = new Date();
    this.buscarUsuario();
    this.listarStatus()
    this.listarPrioridade();
    this.listarCategoria();
    this.buscarTarefas();
    this.filtrarTarefas();
  
  
   }

  buscarUsuario(){
        this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
          (usuario : UsuarioModel) => {
            this.usuarioSelecionado = usuario;
            this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
            this.xp = this.usuarioSelecionado.xp
            this.id_avatar = this.usuarioSelecionado.id_avatar
            this.buscarAvatar()
            
        })
    }
    buscarTarefas(): void {
      this.tarefaService.getTarefas(this.currentUser).subscribe(
        (tarefas: PageTarefaModel) => {
          this.tarefasAnalise = tarefas.data || [];
          this.calcularTarefasPorCategoria();
          this.analise();
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
        this.tarefasConcluidasHoje = this.tarefas.filter(tarefa => tarefa.id_status === 4).length;
        if(this.quantTarefasHoje) this.progresso = Math.round((this.tarefasConcluidasHoje / this.quantTarefasHoje) * 100);
        if(this.progresso == 100){
          this.fraseTarefasDiarias = 'Parabéns! Suas tarefas diárias estão concluídas!'
        } else if(this.progresso >= 50){
          this.fraseTarefasDiarias = 'Suas tarefas diárias estão quase concluídas!'
        }else{
          this.fraseTarefasDiarias = 'Complete suas tarefas diárias!'
        }

      }
     
    }
    analise(){
      if (this.tarefasAnalise && this.categorias && this.prioridades && this.statusList) {
        this.tarefasAnalise.forEach(tarefa => {
            const categoria = this.categorias.find(c => c.id === tarefa.id_categoria);
            if (categoria) {
                tarefa.nome_categoria = categoria.nome;
            }
  
            const prioridade = this.prioridades.find(p => p.id === tarefa.id_prioridade);
            if (prioridade) {
                tarefa.nome_prioridade = prioridade.nome;
            }
        });

        this.totalTarefas = this.tarefasAnalise.length;
        this.tarefasConcluidas = this.tarefasAnalise.filter(tarefa => tarefa.id_status === 4).length;
        this.emProgresso = this.tarefasAnalise.filter(tarefa => tarefa.id_status === 2).length;
        this.aFazer = this.tarefasAnalise.filter(tarefa => tarefa.id_status === 1).length;
        this.atrasadas = this.tarefasAnalise.filter(tarefa => tarefa.id_status === 3).length;
        this.concluida = this.tarefasAnalise.filter(tarefa => tarefa.id_status === 4).length;

    }
    }

    calcularTarefasPorCategoria(): void {
      if (this.tarefasAnalise) {
        const categorias = this.tarefasAnalise.reduce((acc: { [key: string]: number }, tarefa: any) => {
          const categoria = this.categorias.find(c => c.id === tarefa.id_categoria);
          if (categoria) {
            const categoriaNome = categoria.nome;
            acc[categoriaNome] = (acc[categoriaNome] || 0) + 1;
          }
          return acc;
        }, {});
    
        this.chartData = Object.keys(categorias).map(categoriaNome => ({
          name: categoriaNome,
          value: categorias[categoriaNome]
        }));
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
      this.modalComponent.openModal();
    }
  
    recarregarTarefas(): void {
      this.filtrarTarefas();
      this.atualizarFrase();
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
          this.filtrarTarefas(); 
          this.buscarUsuario();
          this.recarregarTarefas();
        },
        (error) => {
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
      params.data_vencimento = this.datePipe.transform(this.dataHoje, 'yyyy-MM-dd');
      if (this.tarefaFiltro) params.nome = this.tarefaFiltro;
  
      this.tarefaService.filtrarTarefas(params, this.currentUser).subscribe(
        (tarefas: PageTarefaModel) => {
          this.tarefas = tarefas.data || [];
          this.quantTarefasHoje = tarefas.total
          this.atualizarFrase();
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
        this.fraseQuantTarefas = 'Nenhuma tarefa com data de vencimento para hoje!';
      } else if (this.quantTarefasHoje == 1) {
        this.fraseQuantTarefas = '1 tarefa';
      } else if (this.quantTarefasHoje > 1) {
        this.fraseQuantTarefas = `${this.quantTarefasHoje} tarefas`;
      }
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
