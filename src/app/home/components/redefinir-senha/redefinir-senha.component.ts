import { Component, OnInit, ViewChild} from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule, AlertasComponent],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.css'
})
export class RedefinirSenhaComponent implements OnInit {
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  formSenha: FormGroup;
  senha?:string;
  senhaconfirmada?:string;
  senhaCoincide: boolean = false;
  idUser?: number;

  constructor(
    private usuarioService: UsuarioService,
    private alertaService:AlertaService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.formSenha = this.formBuilder.group({
      senha: [{ value: '', disabled: false }, Validators.required],
      senhaconfirmada: [{ value: '', disabled: false }, Validators.required]
    });
  }
  
ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.idUser = +params['id']; 
  });

  this.senha = this.formSenha.get('senha')?.value
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

salvar(){
  const senhaCoincide = this.formSenha.get('senha')?.value === this.formSenha.get('senhaconfirmada')?.value;
  this.senha = this.formSenha.get('senha')?.value
  
  if (this.idUser && this.formSenha.valid && senhaCoincide && this.senha) {
    this.usuarioService.mudarsenha(this.idUser,this.senha).subscribe(
      response => {
        this.alertaService.exibirAlerta('success', 'Senha alterada com sucesso!');
      },
      error => {
        this.alertaService.exibirAlerta('danger','Erro ao alterar: ' + error.error.message); 
      })
  } else {
    this.validarTodosCampos(this.formSenha);
    if (this.formSenha.get('senha')?.value != null &&  this.formSenha.get('senhaconfirmada')?.value != null && !senhaCoincide) {
      this.alertaService.exibirAlerta('danger', 'As senhas não coincidem.');
    } else {
      this.alertaService.exibirAlerta('danger', 'Preencha todos os campos corretamente.');
    }
  }

  this.senhaCoincide = senhaCoincide;
}
}
