import { Component, Inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLoginModel } from '../../models/login.model';
import { UsuarioModel } from '../../models/usuario.model';

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

  constructor(
  @Inject(DOCUMENT) private document: Document,
  private authService: AuthServiceService,
  private formBuilder: FormBuilder,
  private usuarioSerive : UsuarioService) {

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
          console.log(this.usuarioSelecionado)
          this.preencherformulario();
      })
  }

  preencherformulario(){
    this.formConfiguracoes.controls['nome'].setValue(this.usuarioSelecionado?.nome);
    this.formConfiguracoes.controls['data_nasc'].setValue(this.formatarData(String(this.usuarioSelecionado?.data_nasc)));
    this.formConfiguracoes.controls['email'].setValue(this.usuarioSelecionado?.email);
    this.formConfiguracoes.controls['telefone'].setValue(this.formatarTelefone(this.usuarioSelecionado?.telefone));
  }


  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    const dia = this.padZero(data.getDate());
    const mes = this.padZero(data.getMonth() + 1); 
    const ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  
  formatarTelefone(telefone: string): string {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length !== 11) {
      return telefone;
    }
    const parte1 = telefoneLimpo.slice(0, 2); 
    const parte2 = telefoneLimpo.slice(2, 7); 
    const parte3 = telefoneLimpo.slice(7); 
    return `(${parte1})${parte2}-${parte3}`;
  }

  }
