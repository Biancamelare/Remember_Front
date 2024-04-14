import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioLoginModel } from '../../models/login.model';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, AlertasComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  formUsuarioLogin: FormGroup;
  usuario?: UsuarioLoginModel;

  usuarioSelecionado: UsuarioLoginModel = {} as UsuarioLoginModel;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private alertaService:AlertaService,
    private router: Router
  ) {
    this.formUsuarioLogin = this.formBuilder.group({
      email: [{ value: '', disabled: false }, [Validators.required,Validators.email]],
      senha: [{ value: '', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.usuarioSelecionado = {} as UsuarioLoginModel;

    this.formUsuarioLogin.get('email')?.setValue(this.usuarioSelecionado.email);
    this.formUsuarioLogin.get('senha')?.setValue(this.usuarioSelecionado.senha);    
}

validarCampo(field: string) {
  const control = this.formUsuarioLogin.get(field);
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

  entrar(){
    if (this.formUsuarioLogin.valid){
      this.usuarioService.login(this.formUsuarioLogin.getRawValue()).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Login realizado com sucesso!');
          this.router.navigate(['/visualizar-tarefas']);
        },
        error => {
          this.alertaService.exibirAlerta('danger','Erro : ' + error.error.message);
        })
    }else{
      this.validarTodosCampos(this.formUsuarioLogin);
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.');
    }
    
  }

}
