import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoresService } from './shared/services/cores.service';
import { AuthServiceService } from './shared/services/auth-service.service';
import { DOCUMENT } from '@angular/common';
import { UsuarioService } from './home/services/usuario.service';
import { UsuarioModel } from './home/models/usuario.model';
import { CoresModel } from './shared/models/cores.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Remember';

currentUser: any;
currentUserId : any;

usuarioSelecionado = {} as UsuarioModel;

coresSelecionado = {} as CoresModel;

idTema?:number;
primaryColor:any
secondaryColor:any
tertiaryColor:any
quaternaryColor:any
inputColor:any
fontColor:any
iconColor:any
shadowColor:any
userColor:any
gradient1Color:any
gradient2Color:any

isLoggedIn ?: boolean


ngOnInit(): void {
  this.isLoggedIn = this.authService.isLoggedIn()
    if (this.isLoggedIn) {
      this.buscarUsuario();
      
    }
}

constructor(
  @Inject(DOCUMENT) private document: Document,
  private coresService: CoresService,
  private authService: AuthServiceService,
  private usuarioSerive : UsuarioService
) {
  const sessionStorage = document.defaultView?.sessionStorage;
  if(sessionStorage){
    this.currentUser = sessionStorage.getItem('user_logged.token')
    this.currentUserId = sessionStorage.getItem('user_logged.id')
    authService.setToken(this.currentUser)
  }
}

buscarUsuario(){
  this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
    (usuario : UsuarioModel) => {
      this.usuarioSelecionado = usuario;
      this.idTema = this.usuarioSelecionado.id_tema
      console.log(this.idTema)
      this.buscarUrl();
  })
}

 async buscarUrl() {

  if(this.idTema){
   const {
     primaryColor,
     secondaryColor,
     tertiaryColor,
     quaternaryColor,
     inputColor,
     fontColor,
     iconColor,
     shadowColor,
     userColor,
     gradient1Color,
     gradient2Color,
   } = await firstValueFrom(this.coresService.getById(this.idTema));
    
  this.primaryColor = primaryColor;
   this.secondaryColor = secondaryColor;
   this.tertiaryColor = tertiaryColor;
   this.quaternaryColor = quaternaryColor;
   this.inputColor = inputColor;
   this.fontColor = fontColor;
   this.iconColor = iconColor;
   this.shadowColor = shadowColor;
   this.userColor = userColor;
   this.gradient1Color = gradient1Color;
   this.gradient2Color = gradient2Color;

   
   this.document.documentElement.style.setProperty('--primarycolor', this.primaryColor);
   this.document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
   this.document.documentElement.style.setProperty('--tertiary-color', this.tertiaryColor);
   this.document.documentElement.style.setProperty('--quaternary-color', this.quaternaryColor);
   this.document.documentElement.style.setProperty('--input-color', this.inputColor);
   this.document.documentElement.style.setProperty('--font-color', this.fontColor);
   this.document.documentElement.style.setProperty('--icon-color', this.iconColor);
   this.document.documentElement.style.setProperty('--shadown-color', this.shadowColor);
   this.document.documentElement.style.setProperty('--gradient1-color', this.gradient1Color);
   this.document.documentElement.style.setProperty('--gradient2-color', this.gradient2Color);

 }

}}

