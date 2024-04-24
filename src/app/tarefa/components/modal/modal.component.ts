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

  constructor(
    private tarefaService: TarefaServiceService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
  ) {

    const localStorage = document.defaultView?.localStorage;
    if(localStorage){
      this.currentUser = localStorage.getItem('user_logged.token')
      this.currentUserId = localStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    }

    this.formTarefa = this.formBuilder.group({
      nome: [{ value: '', disabled: false }, Validators.required],
      descricao: [{ value: '', disabled: false }],
      id_categoria: [{ value: '1', disabled: false }, Validators.required],
      id_status: [{ value: '2', disabled: false }],
      id_prioridade: [{ value: '1', disabled: false }],
      data_vencimento: [{ value: '', disabled: false },Validators.required],
      //hora_conclusao: [{ value: '', disabled: false }],
      //anexo: [{ value: '', disabled: false }],
      anotacao: [{ value: '', disabled: false }],
    });
  }

  ngOnInit(): void {
    
    this.listarCampos();

    this.tarefaSelecionado = {} as TarefaModel;

    this.formTarefa.get('nome')?.setValue(this.tarefaSelecionado.nome);
    this.formTarefa.get('descricao')?.setValue(this.tarefaSelecionado.descricao);
    this.formTarefa.get('id_categoria')?.setValue(Number(this.tarefaSelecionado.id_categoria));
    this.formTarefa.get('data_conclusao')?.setValue(this.tarefaSelecionado.data_vencimento);
   // this.formTarefa.get('hora_conclusao')?.setValue(this.tarefaSelecionado.data_vencimento);
    this.formTarefa.get('anotacao')?.setValue(this.tarefaSelecionado.anotacao);
    this.formTarefa.controls['id_prioridade'].setValue(2);
    this.formTarefa.controls['id_status'].setValue(1);
       
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
      (categorias: CategoriaModel[]) => (this.categorias = categorias));
  }
  

  salvar(): void {
    if (this.formTarefa.valid ) {
      console.log(this.formTarefa.getRawValue())
      this.tarefaService.cadastrarTarefa(this.formTarefa.getRawValue(),this.currentUser).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Tarefa cadastrado com sucesso!');
        },
        error => {
          console.log(this.formTarefa.getRawValue())
          this.alertaService.exibirAlerta('danger','Erro ao cadastrar tarefa: ' + error.error.message); // Exibe a mensagem de erro da API
        })
    } else {
      this.validarTodosCampos(this.formTarefa);
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.')
    }
  
  }

  /*Modal*/
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
