import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TarefaServiceService } from '../../services/tarefa-service.service';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import bootstrap from '../../../../main.server';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ FullCalendarModule, ModalComponent,  AlertasComponent, CommonModule, SidenavComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnInit {
  @ViewChild('modalComponent') modalComponent!: ModalComponent;
  @ViewChild('alertaCadastro', { static: false }) alertaCadastro!: AlertasComponent;
  
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

  tarefaSelecionada: TarefaModel | undefined;


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
    },
    eventClick: this.clicarTarefa.bind(this),
    eventsSet: this.abrirData.bind(this),
    eventDidMount: this.adicionarPropriedade.bind(this) 
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
        id: tarefa.id.toString() 
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

recarregarTarefas(): void {
  this.buscarTarefas();
}

clicarTarefa(arg: any) {
  const tarefaId = arg.event.id;
  this.tarefaSelecionada = this.tarefas?.find(tarefa => tarefa.id.toString() === tarefaId);



  if (this.tarefaSelecionada) {
    this.modalComponent.tarefa = this.tarefaSelecionada;
    this.modalComponent.configurarFormularioComDadosDaTarefa();
    this.modalComponent.openModal();
  }
}

adicionarPropriedade(arg: any) {
  const eventElement = arg.el;
  const dayGridEvents = eventElement.closest('.fc-daygrid-day-events');
  if (dayGridEvents) {
    dayGridEvents.setAttribute('data-bs-target', '#exampleModal');
    dayGridEvents.setAttribute('data-bs-toggle', 'modal');
  }
}

abrirData(events: EventApi[]) {
  const calendarEl = this.document.querySelector('.fc-daygrid-body');
  if (calendarEl) {
    const dayCells = calendarEl.querySelectorAll('.fc-daygrid-day');
    dayCells.forEach(dayCell => {
      dayCell.setAttribute('data-bs-toggle', 'modal'); 
      dayCell.setAttribute('data-bs-target', '#exampleModal');

      dayCell.addEventListener('click', (e: any) => {
        const dateStr = e.currentTarget.getAttribute('data-date');
        if (dateStr) {
          this.modalComponent.abrirModalComData(dateStr);
        }
      });
    });
  }
}


}
