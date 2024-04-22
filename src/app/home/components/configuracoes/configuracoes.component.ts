import { Component, Inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLoginModel } from '../../models/login.model';
import { UsuarioModel } from '../../models/usuario.model';
import { FuncoesService } from '../../../shared/services/funcoes.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [SidenavComponent,ReactiveFormsModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})

export class ConfiguracoesComponent implements OnInit {
  currentUser: any;
  currentUserId : any;
  formConfiguracoes: FormGroup;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;

  constructor(
  @Inject(DOCUMENT) private document: Document,
  private authService: AuthServiceService,
  private formBuilder: FormBuilder,
  private usuarioSerive : UsuarioService,
  private funcoesService: FuncoesService) {

    const localStorage = document.defaultView?.localStorage;
    if(localStorage){
      this.currentUser = localStorage.getItem('user_logged.token')
      this.currentUserId = localStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    }
    this.formConfiguracoes = this.formBuilder.group({
      nome: [{ value: '', disabled: false }, Validators.required],
      email: [{ value: '', disabled: false }, [Validators.required,Validators.email]],
      data_nasc: [{ value: '', disabled: false }, Validators.required],
      telefone: [{ value: '', disabled: false }, Validators.required],
    });
  }


  ngOnInit(): void {
   console.log(this.currentUser)
   this.buscarUsuario();
    
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

  }
