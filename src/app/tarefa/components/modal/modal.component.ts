import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TarefaModel } from '../../models/tarefa.model';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { CategoriaModel } from '../../models/categoria.model';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { PrioridadeModel } from '../../models/prioridade.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule, AlertasComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  formTarefa: FormGroup;
  tarefa?: TarefaModel;

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

  constructor(
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
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
      data_vencimento: [{ value: '', disabled: false },Validators.required],
      //anexo: [{ value: '', disabled: false }],
      anotacao: [{ value: '', disabled: false }],
    });
  }

  ngOnInit(): void {
    
    this.listarCampos();
    this.listarPrioridade()
   
    this.tarefaSelecionado = {} as TarefaModel;

    this.formTarefa.get('nome')?.setValue(this.tarefaSelecionado.nome);
    this.formTarefa.get('descricao')?.setValue(this.tarefaSelecionado.descricao);
    this.formTarefa.get('anotacao')?.setValue(this.tarefaSelecionado.anotacao);
    this.formTarefa.get('id_prioridade')?.setValue(Number(this.tarefaSelecionado.id_prioridade));
    this.formTarefa.controls['id_status'].setValue(1);
    this.formTarefa.get('id_categoria')?.setValue(Number(this.tarefaSelecionado.id_categoria));
    

    if(this.formTarefa.valid){
      this.modalTarget = 'modal'
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

  mostrarCSS(field: string) {
    return {
      'input-erro': this.validarCampo(field),
    };
  }

  listarCampos(){
    this.tarefaService.getCategorias(this.currentUser).subscribe(
      (categorias: CategoriaModel[]) => {this.categorias = categorias; console.log(this.categorias)})

    
  }

  listarPrioridade(){
    this.tarefaService.getPrioridades(this.currentUser).subscribe(
      (prioridades: PrioridadeModel[]) => {this.prioridades = prioridades; console.log(this.prioridades)})

  }
  

  salvar(): void {
   const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement
   const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement

   this.data_conclusao = html_dataconclusao.value
   if(html_horaconclusao.value != ''){
    this.hora_conclusao = html_horaconclusao.value
   }
   const dataHoraConclusao = `${this.data_conclusao}T${this.hora_conclusao}:00.000Z`;
   this.formTarefa.controls['data_vencimento'].setValue(dataHoraConclusao);

    if (this.formTarefa.valid ) {
      console.log(this.formTarefa.getRawValue())
      this.modalTarget = 'modal'
      this.tarefaService.cadastrarTarefa(this.formTarefa.getRawValue(),this.currentUser).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Tarefa cadastrado com sucesso!');
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
      this.formTarefa.enable()
      const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement
      const html_horaconclusao = this.document.querySelector('#hora_conclusao') as HTMLInputElement

      html_dataconclusao.value = ''
      html_horaconclusao.value = ''
  }

}
