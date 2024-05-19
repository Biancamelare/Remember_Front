import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoresService } from './shared/services/cores.service';
import { AuthServiceService } from './shared/services/auth-service.service';
import { DOCUMENT } from '@angular/common';

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
corPrimaria: any;
corSecundaria: any;
corDeFundo: any;
corDeAviso: any;
corDeHover: any;
corDark: any;
corDeInfo: any;
corDePerigo: any;
corDeSucesso: any;
corLight: any;
corDeTexto: any;
corTextoGeral: any;


ngOnInit(): void {
  //this.buscarUrl();
}

constructor(
  @Inject(DOCUMENT) private document: Document,
  private coresService: CoresService,
  private authService: AuthServiceService
) {
  const sessionStorage = document.defaultView?.sessionStorage;
  if(sessionStorage){
    this.currentUser = sessionStorage.getItem('user_logged.token')
    this.currentUserId = sessionStorage.getItem('user_logged.id')
    authService.setToken(this.currentUser)
  }
}

  /*async buscarUrl() {

    onst {
      corPrimaria,
      corSecundaria,
      corDeFundo,
      corDeAviso,
      corDeHover,
      corDark,
      corDeInfo,
      corDePerigo,
      corDeSucesso,
      corLight,
      corDeTexto,
      corDeTextoGeral
    } = await firstValueFrom(this.coresService.buscarAtivo());

    this.corPrimaria = corPrimaria;
    this.corSecundaria = corSecundaria;
    this.corDeFundo = corDeFundo;
    this.corDark = corDark;
    this.corDeAviso = corDeAviso;
    this.corDeHover = corDeHover;
    this.corDeInfo = corDeInfo;
    this.corDePerigo = corDePerigo;
    this.corDeSucesso = corDeSucesso;
    this.corLight = corLight;
    this.corDeTexto = corDeTexto;
    this.corTextoGeral = corDeTextoGeral;
    console.log(corDeTextoGeral);


    document.documentElement.style.setProperty('--secondary-color', this.corSecundaria);
    document.documentElement.style.setProperty('--primary-color', this.corPrimaria);
    document.documentElement.style.setProperty('--background-color', this.corDeFundo);
    document.documentElement.style.setProperty('--dark-color', this.corDark);
    document.documentElement.style.setProperty('--warn-color', this.corDeAviso);
    document.documentElement.style.setProperty('--hover-color', this.corDeHover);
    document.documentElement.style.setProperty('--danger-color', this.corDePerigo);
    document.documentElement.style.setProperty('--sucess-color', this.corDeSucesso);
    document.documentElement.style.setProperty('--info-color', this.corDeInfo);
    document.documentElement.style.setProperty('--light-color', this.corLight);
    document.documentElement.style.setProperty('--text-color', this.corDeTexto);
    document.documentElement.style.setProperty('--geral-text-color', this.corTextoGeral);

  }*/
}
