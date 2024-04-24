import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule, AlertasComponent],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})

export class CadastroUsuarioComponent implements OnInit{
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  formUsuario: FormGroup;
  usuario?: UsuarioModel;

  senhaCoincide: boolean = false;

  usuarioSelecionado: UsuarioModel = {} as UsuarioModel;

  constructor(
    private usuarioService: UsuarioService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
  ) {
    this.formUsuario = this.formBuilder.group({
      nome: [{ value: '', disabled: false }, Validators.required],
      email: [{ value: '', disabled: false }, [Validators.required,Validators.email]],
      data_nasc: [{ value: '', disabled: false }, Validators.required],
      telefone: [{ value: '', disabled: false }, Validators.required],
      senha: [{ value: '', disabled: false }, Validators.required],
      senhaconfirmada: [{ value: '', disabled: false }, Validators.required]
    });
  }

  ngOnInit(): void {
    
    this.usuarioSelecionado = {} as UsuarioModel;
    const telefoneNumerico = this.formUsuario.get('telefone')?.value.replace(/\D/g, ''); 

    this.formUsuario.get('email')?.setValue(this.usuarioSelecionado.email);
    
    this.formUsuario.get('telefone')?.setValue(telefoneNumerico);
    this.formUsuario.get('nome')?.setValue(this.usuarioSelecionado.nome);
    this.formUsuario.get('data_nasc')?.setValue(this.usuarioSelecionado.data_nasc);
    this.formUsuario.get('senha')?.setValue(this.usuarioSelecionado.senha); 
    
       
}

  /*VALIDAÇÕES */
  validarCampo(field: string) {
    const control = this.formUsuario.get(field);
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
  

  salvar(): void {
    const senhaCoincide = this.formUsuario.get('senha')?.value === this.formUsuario.get('senhaconfirmada')?.value;
  
    if (this.formUsuario.valid && senhaCoincide) {
      this.usuarioService.cadastrarUsuario(this.formUsuario.getRawValue()).subscribe(
        response => {
          this.alertaService.exibirAlerta('success', 'Usuário cadastrado com sucesso!');
        },
        error => {
          this.alertaService.exibirAlerta('danger','Erro ao cadastrar usuário: ' + error.error.message); // Exibe a mensagem de erro da API
        })
    } else {
      this.validarTodosCampos(this.formUsuario);
      if (this.formUsuario.get('senha')?.value != null &&  this.formUsuario.get('senhaconfirmada')?.value != null && !senhaCoincide) {
        this.alertaService.exibirAlerta('danger', 'As senhas não coincidem.');
      } else {
        this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.');
      }
    }
  
    this.senhaCoincide = senhaCoincide;
  }
  

  
}
