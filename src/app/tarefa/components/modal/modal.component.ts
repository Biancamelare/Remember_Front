import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { TarefaModel } from '../../models/tarefa.model';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { CategoriaModel } from '../../models/categoria.model';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { PrioridadeModel } from '../../models/prioridade.model';
import { ConfirmacaoService } from '../../../shared/components/confirm/service/confirm.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ListaTarefa } from '../../models/listaTarefa.model';
import { PageTarefaModel } from '../../models/pageTarefas.model';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule, AlertasComponent, ConfirmComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [DatePipe]
})
export class ModalComponent implements OnInit,OnChanges {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  @Output() tarefaSalva: EventEmitter<any> = new EventEmitter<any>();
  @Input() tarefa: TarefaModel | undefined;
  formTarefa: FormGroup;

  editar: boolean = false;

  
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;

  tarefaSelecionado: TarefaModel = {} as TarefaModel;

  categorias: CategoriaModel[] = [] as CategoriaModel[];
  categoria: CategoriaModel[] = [];
  categoriaSelecionada: any;

  prioridades: PrioridadeModel[] = [] as PrioridadeModel[];
  prioridade: PrioridadeModel[] = [];

  hora_conclusao: string = '00:00'
  data_conclusao ?: string

  modalTarget: string = '';

  minDate: Date = new Date(); 

  itensListaVerificacao: string[] = [];

  constructor(
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private datePipe: DatePipe,
    private confirmacaoService: ConfirmacaoService
  ) {

    const sessionStorage = document.defaultView?.sessionStorage;
    if(sessionStorage){
      this.currentUser = sessionStorage.getItem('user_logged.token')
      this.currentUserId = sessionStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    }
   
    this.formTarefa = this.formBuilder.group({
      nome: [{ value: '', disabled: false }, Validators.required],
      descricao: [{ value: '1', disabled: false }],
      id_categoria: [{ value: '', disabled: false }, Validators.required],
      id_status: [{ value: '2', disabled: false }],
      id_prioridade: [{ value: '', disabled: false },Validators.required],
      data_vencimento: [{ value: '', disabled: false }],
      anotacao: [{ value: '', disabled: false }],
      lista_tarefa: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {

    this.editar = false;
    
    this.listarCategoria();
    this.listarPrioridade()
   
    this.tarefaSelecionado = {} as TarefaModel;

    this.formTarefa.get('nome')?.setValue(this.tarefaSelecionado.nome);
    this.formTarefa.get('descricao')?.setValue(this.tarefaSelecionado.descricao);
    this.formTarefa.get('anotacao')?.setValue(this.tarefaSelecionado.anotacao);
    this.formTarefa.get('id_prioridade')?.setValue(Number(this.tarefaSelecionado.id_prioridade));
    this.formTarefa.controls['id_status'].setValue(2);
    this.formTarefa.get('id_categoria')?.setValue(Number(this.tarefaSelecionado.id_categoria));
    

    if(this.formTarefa.valid){
      this.modalTarget = 'modal'
    }

    this.limparLista();

 
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarefa'] && this.tarefa) {
      this.configurarFormularioComDadosDaTarefa();
      /*this.editar = true;
      this.formTarefa.patchValue(this.tarefa);
      const dataFormatada = this.datePipe.transform(this.tarefa.data_vencimento, 'yyyy-MM-dd', 'UTC');
      if (dataFormatada) {
        this.data_conclusao = dataFormatada;
      }
      const horaFormatada = this.datePipe.transform(this.tarefa.data_vencimento, 'HH:mm','UTC');
      if (horaFormatada) {
        this.hora_conclusao = horaFormatada;
      }
      this.inicializarLista(); */  
    }
  }

  configurarFormularioComDadosDaTarefa(): void {
    if (this.tarefa) {
      this.editar = true;
      this.formTarefa.patchValue(this.tarefa);
  
      const dataFormatada = this.datePipe.transform(this.tarefa.data_vencimento, 'yyyy-MM-dd', 'UTC');
      const horaFormatada = this.datePipe.transform(this.tarefa.data_vencimento, 'HH:mm', 'UTC');
  
      this.data_conclusao = dataFormatada ?? '';
      this.hora_conclusao = horaFormatada ?? '00:00';
  
      const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement;
      const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement;
      if (html_dataconclusao) {
        html_dataconclusao.value = this.data_conclusao;
      }
      if (html_horaconclusao) {
        html_horaconclusao.value = this.hora_conclusao;
      }
      this.inicializarLista();
    }
  }


  /*VALIDAÇÕES */
  validarCampo(field: string) {
    const control = this.formTarefa.get(field);
    return !control?.valid && control?.touched;
  }

  validarTodosCampos(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validarTodosCampos(control);
      }
    });
  }

  isInvalid(control: AbstractControl | null, controlName?: string): boolean {
    if (controlName && control instanceof FormGroup) {
      control = control.get(controlName);
    }
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  mostrarCSS(field: string) {
    return {
      'input-erro': this.validarCampo(field),
    };
  }

  listarCategoria(){
    this.tarefaService.getCategorias(this.currentUser).subscribe(
      (categorias: CategoriaModel[]) => {this.categorias = categorias; })
  }

  listarPrioridade(){
    this.tarefaService.getPrioridades(this.currentUser).subscribe(
      (prioridades: PrioridadeModel[]) => {this.prioridades = prioridades; })
  }
  

  salvar(): void {
   const listaVerificacao: { descricao: string, status: boolean }[] = [];
   const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement
   const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement

   const itensListaVerificacaoControls = this.getItensListaVerificacaoControls();
   itensListaVerificacaoControls.forEach(control => {
     const descricao = control.get('descricao')?.value.trim();
     const status = control.get('status')?.value;
     if (descricao !== '') {
       listaVerificacao.push({
         descricao: descricao,
         status: status
       });
     }
   });


   this.data_conclusao = html_dataconclusao.value
   if(html_horaconclusao.value != ''){
    this.hora_conclusao = html_horaconclusao.value
   }
   const dataHoraConclusao = `${this.data_conclusao}T${this.hora_conclusao}:00.000Z`;
   if(dataHoraConclusao != 'T00:00:00.000Z'){
    this.formTarefa.controls['data_vencimento'].setValue(dataHoraConclusao);
   }
   this.formTarefa.controls['id_status'].setValue(1);

    if (this.formTarefa.valid) {
      this.modalTarget = 'modal'
      const dadosTarefa = {
        ...this.formTarefa.getRawValue(), 
        lista_tarefa: listaVerificacao 
    };
    console.log(dadosTarefa)
    
      this.modalTarget = 'modal'
      this.tarefaService.cadastrarTarefa(dadosTarefa,this.currentUser).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Tarefa cadastrado com sucesso!');
          this.tarefaSalva.emit();
          this.closeModal()
        },
        error => {
          this.alertaService.exibirAlerta('danger','Erro ao cadastrar tarefa: ' + error.error.message); // Exibe a mensagem de erro da API
        })
    } else {
      this.validarTodosCampos(this.formTarefa);
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.')
    }
  
  }

  async excluir(){
    if(this.tarefa){
      const resposta = await this.confirmacaoService.exibirConfirmacao('Deseja realmente excluir a tarefa?');
      if(resposta){
        this.tarefaService.excluirTarefa(this.tarefa.id, this.currentUser).subscribe(
          response => {
            this.alertaService.exibirAlerta('success', 'Tarefa excluída com sucesso!');
            this.tarefaSalva.emit();
            this.closeModal()
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao excluir tarefa: ' + error.error.message); 
          })
      }
    }
  }

  async editarTarefa(){
    const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement
    const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement

    this.data_conclusao = html_dataconclusao.value
    if(html_horaconclusao.value != ''){
     this.hora_conclusao = html_horaconclusao.value
    }
    const dataHoraConclusao = `${this.data_conclusao}T${this.hora_conclusao}:00.000Z`;
    if(dataHoraConclusao != 'T00:00:00.000Z'){
     this.formTarefa.controls['data_vencimento'].setValue(dataHoraConclusao);
    }

    if(this.tarefa){
      if(this.formTarefa.valid){
        const resposta = await this.confirmacaoService.exibirConfirmacao('Deseja realmente editar a tarefa?');
      if(resposta){
        const dadosTarefa = { ...this.formTarefa.getRawValue() };
        delete dadosTarefa.lista_tarefa;
        console.log(dadosTarefa)
        this.tarefaService.editarTarefa(this.tarefa.id, dadosTarefa, this.currentUser).subscribe(
          response => {
            this.salvarItensListaVerificacao()
            this.alertaService.exibirAlerta('success', 'Tarefa editada com sucesso!');
            this.tarefaSalva.emit();
            this.closeModal()
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao editar tarefa: ' + error.error.message); 
          })
      }
      }else {
        this.validarTodosCampos(this.formTarefa);
        this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.')
      }
    }
  }

  /*Modal*/
  openModal() {
    this.formTarefa.enable()
    const modalDiv = document.getElementById('exampleModal');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {
      this.formTarefa.reset();
      this.formTarefa.enable();
      this.limparLista();
      this.editar = false;
      const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement
      const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement

      html_dataconclusao.value = ''
      html_horaconclusao.value = ''
      }

  //Lista
  adicionarItem(descricao: string = '', status: boolean = false, id?: number): void {
    const novoItem = this.formBuilder.group({
      descricao: [descricao, Validators.required],
      status: [status],
      id: [id]  
    });
    (this.formTarefa.get('lista_tarefa') as FormArray).push(novoItem);
  }
    getItensListaVerificacaoControls() {
      return (this.formTarefa.get('lista_tarefa') as FormArray).controls;
    }

    inicializarLista(): void {
      (this.formTarefa.get('lista_tarefa') as FormArray).clear();

      if (this.tarefa && this.tarefa.lista_tarefa) {
        this.tarefa.lista_tarefa.forEach(item => {
          const novoItem = this.formBuilder.group({
            id: [item.id],
            descricao: [item.descricao, Validators.required],
            status: [item.status]
          });
          (this.formTarefa.get('lista_tarefa') as FormArray).push(novoItem)
        });
        
      }
   
    }

    limparLista(){
      (this.formTarefa.get('lista_tarefa') as FormArray).clear();
    }
    removerItem(index: number): void {
      const item = (this.formTarefa.get('lista_tarefa') as FormArray).at(index);
      const itemId = item.get('id')?.value;
      
      if (itemId) {
        this.tarefaService.excluirItemLista(itemId, this.currentUser).subscribe(
          response => {
            (this.formTarefa.get('lista_tarefa') as FormArray).removeAt(index);
          },
          error => {
            this.alertaService.exibirAlerta('danger', 'Erro ao excluir item: ' + error.error.message);
          }
        );
      } else {
        (this.formTarefa.get('lista_tarefa') as FormArray).removeAt(index);
      }
    }
    salvarItensListaVerificacao(): void {
      const itensListaVerificacao = this.getItensListaVerificacaoControls();
      itensListaVerificacao.forEach(control => {
        const descricao = control.get('descricao')?.value.trim();
        const status = control.get('status')?.value;
        const id = control.get('id')?.value;
    
        if (id) {
          this.tarefaService.editarLista(id, { descricao, status }, this.currentUser).subscribe(
            response => {
            },
            error => {
              this.alertaService.exibirAlerta('danger', 'Erro ao editar item: ' + error.error.message);
            }
          );
        } else if (descricao !== '') {
          const newItem = { descricao, status, task_id: this.tarefa?.id };
          this.tarefaService.cadastrarItemLista(newItem, this.currentUser).subscribe(
            response => {
            },
            error => {
              this.alertaService.exibirAlerta('danger', 'Erro ao adicionar item: ' + error.error.message);
            }
          );
        }
      });
    }
    alterarStatusItem(index: number): void {
      const item = (this.formTarefa.get('lista_tarefa') as FormArray).at(index);
      const itemId = item.get('id')?.value;
      const novoStatus = !item.get('status')?.value;
      if (itemId) {
        console.log(itemId,novoStatus)
        this.tarefaService.editarLista(itemId, { status: novoStatus }, this.currentUser).subscribe(
          response => {
            item.get('status')?.setValue(novoStatus);
          },
          error => {
            this.alertaService.exibirAlerta('danger', 'Erro ao alterar status do item: ' + error.error.message);
          }
        );
      }
    }
    
  abrirModalComData(data: string) {
      this.formTarefa.enable();
      this.formTarefa.reset();
      this.limparLista();
      this.editar = false;
    
      this.data_conclusao = data;
      const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement;
      if (html_dataconclusao) {
        html_dataconclusao.value = this.data_conclusao;
      }

    }


}
