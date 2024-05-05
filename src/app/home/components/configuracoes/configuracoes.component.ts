import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLoginModel } from '../../models/login.model';
import { UsuarioModel } from '../../models/usuario.model';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { ConfirmacaoService } from '../../../shared/components/confirm/service/confirm.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ModalIconComponent } from "../../../shared/components/modal-icon/modal-icon.component";

@Component({
    selector: 'app-configuracoes',
    standalone: true,
    templateUrl: './configuracoes.component.html',
    styleUrl: './configuracoes.component.css',
    imports: [SidenavComponent, ReactiveFormsModule, FormsModule, CommonModule, AlertasComponent, ConfirmComponent, ModalIconComponent]
})

export class ConfiguracoesComponent implements OnInit {

  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  @ViewChild('confirmModal', { static: false }) confirmModal!: ConfirmComponent;

  currentUser: any;
  currentUserId : any;
  formConfiguracoes: FormGroup;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;
  salvarhabilitado: boolean = false;
  cancelarhabilitado: boolean = false;
  modalTarget:string = '';

  constructor(
  @Inject(DOCUMENT) private document: Document,
  private authService: AuthServiceService,
  private formBuilder: FormBuilder,
  private usuarioSerive : UsuarioService,
  private funcoesService: FuncoesService,
  private alertaService:AlertaService,
  private confirmacaoService: ConfirmacaoService) {

    const sessionStorage = document.defaultView?.sessionStorage;
    if(sessionStorage){
      this.currentUser = sessionStorage.getItem('user_logged.token')
      this.currentUserId = sessionStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    }
    this.formConfiguracoes = this.formBuilder.group({
      nome: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.email,Validators.required]],
      data_nasc: [{ value: '', disabled: true }, [Validators.required]],
      telefone: [{ value: '', disabled: true }, [Validators.required]],
    });
  }


  ngOnInit(): void {
   this.buscarUsuario();

   this.formConfiguracoes.get('email')?.setValue(this.usuarioSelecionado.email);
   this.formConfiguracoes.get('nome')?.setValue(this.usuarioSelecionado.nome);
   this.formConfiguracoes.get('data_nasc')?.setValue(this.funcoesService.formatarData(String(this.usuarioSelecionado?.data_nasc)));
  }


  buscarUsuario(){
    this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
      (usuario : UsuarioModel) => {
        this.usuarioSelecionado = usuario;
        this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
        this.preencherformulario();
    })
}

  preencherformulario(){
    this.formConfiguracoes.controls['nome'].setValue(this.usuarioSelecionado?.nome);
    this.formConfiguracoes.controls['data_nasc'].setValue(this.funcoesService.formatarData(String(this.usuarioSelecionado?.data_nasc)));
    this.formConfiguracoes.controls['email'].setValue(this.usuarioSelecionado?.email);
    this.formConfiguracoes.controls['telefone'].setValue(this.funcoesService.formatarTelefone(this.usuarioSelecionado?.telefone));
  }

  logout(){
    this.authService.logout();
  }

  editar(){
    this.salvarhabilitado = true
    this.cancelarhabilitado = true
    this.formConfiguracoes.enable();
  }

  cancelar(){
    this.salvarhabilitado = false;
    this.cancelarhabilitado = false;
    this.formConfiguracoes.disable();
    this.formConfiguracoes.reset();
    this.preencherformulario()
  }

  async salvar(){
    const telefoneNumerico = this.formConfiguracoes.get('telefone')?.value.replace(/\D/g, ''); 
    this.formConfiguracoes.get('telefone')?.setValue(telefoneNumerico);
    if (this.formConfiguracoes.valid ) {
      const resposta = await this.confirmacaoService.exibirConfirmacao('Deseja realmente alterar?');
      if(resposta){
        this.usuarioSerive.editarUsuario(this.formConfiguracoes.getRawValue(), this.currentUserId, this.currentUser).subscribe(
          response => {
            this.alertaService.exibirAlerta('success', 'Usuário editado com sucesso!');
            this.salvarhabilitado = false
            this.cancelarhabilitado = false
            this.formConfiguracoes.disable();
            this.buscarUsuario();
          },
          error => {
            this.alertaService.exibirAlerta('danger','Erro ao editar o usuário: ' + error.error.message); 
            this.salvarhabilitado = false
            this.cancelarhabilitado = false
            this.formConfiguracoes.disable();
            this.buscarUsuario();
          })
      }else{
        this.salvarhabilitado = false
        this.cancelarhabilitado = false
        this.formConfiguracoes.disable();
        this.buscarUsuario();
      }
    } else {
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.');
    }
  }

  validarCampo(field: string) {
    const control = this.formConfiguracoes.get(field);
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

  formatarTelefone(event: Event): void {
    const target = event.target as HTMLInputElement; 
    if (target && target.value) { 
      const telefoneNumerico = target.value.replace(/\D/g, ''); 
      const match = telefoneNumerico.match(/^(\d{2})(\d{5})(\d{4})$/);
  
      if (match) {
        target.value = `(${match[1]}) ${match[2]}-${match[3]}`; 
      }
    }
  }
  mostrarCSS(field: string) {
    return {
      'input-erro': this.validarCampo(field),
    };
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
  }
