import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})

export class CadastroUsuarioComponent implements OnInit{

  formUsuario: FormGroup;
  usuario?: UsuarioModel;

  usuarioSelecionado: UsuarioModel = {} as UsuarioModel;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
  ) {
    this.formUsuario = this.formBuilder.group({
      id: [{ value: '', disabled: false }],
      nome: [{ value: '', disabled: false }, Validators.required],
      email: [{ value: '', disabled: false }, [Validators.required,Validators.email]],
      data_nasc: [{ value: '', disabled: false }, Validators.required],
      telefone: [{ value: '', disabled: false }, Validators.required],
      senha: [{ value: '', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.usuarioSelecionado = {} as UsuarioModel;

    if (this.usuarioSelecionado.id != undefined){
       
      this.formUsuario.get('id')?.setValue(this.usuarioSelecionado.id);
      this.formUsuario.get('email')?.setValue(this.usuarioSelecionado.email);
      this.formUsuario.get('telefone')?.setValue(this.usuarioSelecionado.telefone);
      this.formUsuario.get('nome')?.setValue(this.usuarioSelecionado.nome);
      this.formUsuario.get('data_nasc')?.setValue(this.usuarioSelecionado.data_nasc);
      this.formUsuario.get('senha')?.setValue(this.usuarioSelecionado.senha);
    }
}

  /*VALIDAÇÕES */
  validarCampo(field: string) {
    return (
      !this.formUsuario.get(field)?.valid &&
      this.formUsuario.get(field)?.touched
    );
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

  salvar(): void {

    this.usuarioService
    .salvar(this.usuarioSelecionado)
    /*if (this.formUsuario.valid) {
      this.usuarioService
        .salvar(this.formUsuario.getRawValue())
    } else {
      this.validarTodosCampos(this.formUsuario);
    }*/
  }

  
}
