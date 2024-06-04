import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { TarefaServiceService } from '../../../tarefa/services/tarefa-service.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { ConfirmacaoService } from '../../../shared/components/confirm/service/confirm.service';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { TransacaoModel } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';

@Component({
  selector: 'app-model-financeiro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule, AlertasComponent, ConfirmComponent],
  templateUrl: './model-financeiro.component.html',
  styleUrl: './model-financeiro.component.css',
  providers: [DatePipe]
})
export class ModelFinanceiroComponent implements OnInit, OnChanges {

  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  @Output() transacaoSalva: EventEmitter<any> = new EventEmitter<any>();
  @Input()transacao: TransacaoModel | undefined;

  formTransacao: FormGroup;
  
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;

  transacaoSelecionado: TransacaoModel = {} as TransacaoModel;

  editar: boolean = false;

  data ?: string

  constructor(
    private transacaoService: TransacaoService,
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
   
    this.formTransacao = this.formBuilder.group({
      descricao: [{ value: '', disabled: false }, Validators.required],
      categoria: [{ value: '', disabled: false }, Validators.required],
      vencimento_em: [{ value: '', disabled: false }],
      preco: [{ value: '', disabled: false }, Validators.required],
      tipo: [{ value: '', disabled: false }, Validators.required]
    });
  }

  ngOnInit(): void {

    this.transacaoSelecionado = {} as TransacaoModel;

    this.formTransacao.get('descricao')?.setValue(this.transacaoSelecionado.descricao);
    this.formTransacao.get('categoria')?.setValue(this.transacaoSelecionado.categoria);
    this.formTransacao.get('preco')?.setValue(this.transacaoSelecionado.preco);
    this.formTransacao.get('tipo')?.setValue(this.transacaoSelecionado.tipo);
    this.formTransacao.get('vencimento_em')?.setValue(this.transacaoSelecionado.vencimento_em);

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transacao'] && this.transacao) {
      this.configurarFormularioComDadosDaTransacao();
    }
  }

  salvar(): void {
 
     if (this.formTransacao.valid) {
      console.log(this.formTransacao.getRawValue())
       this.transacaoService.cadastrarTransacao(this.formTransacao.getRawValue(),this.currentUser).subscribe(
         response => {
           this.alertaService.exibirAlerta('success', 'Transação financeira cadastrado com sucesso!');
           this.transacaoSalva.emit();
           this.closeModal()
         },
         error => {
           this.alertaService.exibirAlerta('danger','Erro ao cadastrar transação financeira: ' + error.error.message); // Exibe a mensagem de erro da API
         })
     } else {
       this.validarTodosCampos(this.formTransacao);
       this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.')
     }
   
   }

   async editarTransacao(){
    if(this.transacao){
      if(this.formTransacao.valid){
        const resposta = await this.confirmacaoService.exibirConfirmacao('Deseja realmente editar a transação financeira?');
      if(resposta){
        this.transacaoService.editarTransacao(this.transacao.id, this.formTransacao.getRawValue(), this.currentUser).subscribe(
          response => {
            this.alertaService.exibirAlerta('success', 'Transação financeira editada com sucesso!');
            this.transacaoSalva.emit();
            this.closeModal()
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao editar transação financeira: ' + error.error.message); 
          })
      }
      }else {
        this.validarTodosCampos(this.formTransacao);
        this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.')
      }
    }
  }

   configurarFormularioComDadosDaTransacao(): void {
    if (this.transacao) {
      this.editar = true;
      this.formTransacao.patchValue(this.transacao);
  
      const dataFormatada = this.datePipe.transform(this.transacao.vencimento_em, 'yyyy-MM-dd', 'UTC');

      this.data = dataFormatada ?? '';
  
      const html_dataconclusao = this.document.querySelector('#data_conclusao') as HTMLInputElement;
      if (html_dataconclusao) {
        html_dataconclusao.value = this.data;
      }
  
    }
  }

  async excluir(){
    if(this.transacao){
      const resposta = await this.confirmacaoService.exibirConfirmacao('Deseja realmente excluir a transação financeir?');
      if(resposta){
        this.transacaoService.excluirTransacao(this.transacao.id, this.currentUser).subscribe(
          response => {
            this.alertaService.exibirAlerta('success', 'Transação financeira excluída com sucesso!');
            this.transacaoSalva.emit();
            this.closeModal()
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao excluir transação financeira: ' + error.error.message); 
          })
      }
    }
  }
 


  openModal() {
    const modalDiv = document.getElementById('modalTransacao');
    if(modalDiv!= null) {
      modalDiv.style.display = 'block';
    }
  }
  closeModal() {
    this.formTransacao.reset();
    this.formTransacao.enable();
    this.editar = false;
  }

    /*VALIDAÇÕES */
    validarCampo(field: string) {
      const control = this.formTransacao.get(field);
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

}
