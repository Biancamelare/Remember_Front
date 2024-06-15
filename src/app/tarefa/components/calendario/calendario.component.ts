import { Component, Inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { UsuarioModel } from '../../../home/models/usuario.model';
import { PageTarefaModel } from '../../models/pageTarefas.model';
import { TarefaModel } from '../../models/tarefa.model';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UsuarioService } from '../../../home/services/usuario.service';
import { FuncoesService } from '../../../shared/services/funcoes.service';
import { AlertaService } from '../../../shared/components/alertas/service/alerta.service';
import { CoresService } from '../../../shared/services/cores.service';
import { AvatarModel } from '../../../shared/models/avatar.model';
import { AlertasComponent } from '../../../shared/components/alertas/alertas.component';
import { ModalComponent } from '../modal/modal.component';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ FullCalendarModule, ModalComponent,  AlertasComponent, CommonModule, SidenavComponent],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnInit {
  
  currentUser: any;
  currentUserId : any;
  usuarioSelecionado = {} as UsuarioModel;
  nome?: string;
  xp?: number;

  tarefaPage?:PageTarefaModel
  tarefa: TarefaModel[] = [];
  tarefas?: TarefaModel[]

  stringBase64: any;
  id_avatar?:number;
  avatarSelecionado = {} as AvatarModel;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
     locales: [ptBrLocale],
    locale: 'pt-br',
    events: [],
    buttonText: {
      today:    'Hoje',
      month:    'Mês',
      week:     'Semana',
      day:      'Dia',
      list:     'Lista'
    },
    titleFormat: { 
      year: 'numeric',
      month: 'long'    
    },
    dayHeaderFormat: { 
      weekday: 'long' 
    }
  };

  constructor(private tarefaService: TarefaServiceService,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthServiceService,
    private usuarioSerive : UsuarioService,
    private funcoesService: FuncoesService,
    private alertaService:AlertaService,
    private coresService: CoresService,
  ) {
    const sessionStorage = document.defaultView?.sessionStorage;
    if(sessionStorage){
      this.currentUser = sessionStorage.getItem('user_logged.token')
      this.currentUserId = sessionStorage.getItem('user_logged.id')
      authService.setToken(this.currentUser)
    }
  }

  ngOnInit(): void {
    this.buscarUsuario();
    this.buscarTarefas();
   
  }

  buscarUsuario(){
    this.usuarioSerive.getById(this.currentUserId,this.currentUser).subscribe( 
      (usuario : UsuarioModel) => {
        this.usuarioSelecionado = usuario;
        this.xp = this.usuarioSelecionado.xp
        this.nome = this.funcoesService.formatarNomeCompleto(this.usuarioSelecionado.nome)
        this.id_avatar = this.usuarioSelecionado.id_avatar
        this.buscarAvatar()
    })
}

buscarTarefas(): void {
  this.tarefaService.getTarefas(this.currentUser).subscribe(
    (tarefas: PageTarefaModel) => {
      this.tarefas = tarefas.data || [];
      this.calendarOptions.events = this.tarefas.map(tarefa => ({
        title: tarefa.nome,
        start: tarefa.data_vencimento,
      }));
    },
    (error) => {
      this.alertaService.exibirAlerta('danger', 'Erro ao buscar tarefas: ' + error.error.message);
    }
  );
}

buscarAvatar() {
  if(this.id_avatar){
    this.coresService.getByIdTema(this.id_avatar,this.currentUser).subscribe( 
      (avatar : AvatarModel) => {
        this.avatarSelecionado = avatar;
        this.stringBase64 = 'data:image/jpg;base64,' + avatar.url_foto
    })
  }

}

logout(){
  this.authService.logout();
}

}
