import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioLoginModel } from '../../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formUsuarioLogin: FormGroup;
  usuario?: UsuarioLoginModel;

  usuarioSelecionado: UsuarioLoginModel = {} as UsuarioLoginModel;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
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

  entrar(){
    this.usuarioService.login(this.formUsuarioLogin.getRawValue())
  }

}
