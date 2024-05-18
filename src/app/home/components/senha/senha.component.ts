import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-senha',
  standalone: true,
  imports: [AlertasComponent,ReactiveFormsModule, FormsModule],
  templateUrl: './senha.component.html',
  styleUrl: './senha.component.css'
})
export class SenhaComponent implements OnInit {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  formSenha: FormGroup;
  email?:string;
  usuarioSelecionado: UsuarioModel = {} as UsuarioModel;

  constructor(
    private usuarioService: UsuarioService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
  ) {
    this.formSenha = this.formBuilder.group({
      email: [{ value: '', disabled: false }, [Validators.required,Validators.email]],
    });
  }

  ngOnInit(): void {
    this.email = this.formSenha.get('email')?.value
  }

  validarCampo(field: string) {
    const control = this.formSenha.get(field);
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

  salvar(): void {
    this.email = this.formSenha.get('email')?.value
    if (this.formSenha.valid && this.email) {
      this.usuarioService.esquecersenha(this.email).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Email enviado com sucesso!');
        },
        error => {
          this.alertaService.exibirAlerta('danger','Erro ao enviar email: ' + error.error.message); // Exibe a mensagem de erro da API
        })
    } else {
      this.validarTodosCampos(this.formSenha);
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.');
    }
  }
  
  

}


