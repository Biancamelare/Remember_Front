import { Routes } from '@angular/router';
import { LoginComponent } from './home/components/login/login.component';
import { CadastroUsuarioComponent } from './home/components/cadastro-usuario/cadastro-usuario.component';
import { RedefinirSenhaComponent } from './home/components/redefinir-senha/redefinir-senha.component';
import { SenhaComponent } from './home/components/senha/senha.component';
import { ConfiguracoesComponent } from './home/components/configuracoes/configuracoes.component';
import { VisualizarTarefasComponent } from './tarefa/components/visualizar-tarefas/visualizar-tarefas.component';
import { ModalComponent } from './tarefa/components/modal/modal.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { HomeComponent } from './tarefa/components/home/home.component';
import { ModalIconComponent } from './shared/components/modal-icon/modal-icon.component';
import { TarefaDiaComponent } from './tarefa/components/tarefa-dia/tarefa-dia.component';
import { ListaFinanceiroComponent } from './financeiro/components/lista-financeiro/lista-financeiro.component';
import { ModelFinanceiroComponent } from './financeiro/components/model-financeiro/model-financeiro.component';
import { CalendarioComponent } from './tarefa/components/calendario/calendario.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'cadastro-usuario',
        component: CadastroUsuarioComponent
    },
    {
        path: 'configuracoes',
        component: ConfiguracoesComponent,
        canActivate: [AuthGuardService]
    
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'redefinir-senha/:id',
        component: RedefinirSenhaComponent
    },
    {
        path: 'senha',
        component: SenhaComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'dia',
        component: TarefaDiaComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'visualizar-tarefas',
        component: VisualizarTarefasComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'modal',
        component: ModalComponent,
        canActivate: [AuthGuardService]
        
    },
    {
        path: 'modal-icon',
        component: ModalIconComponent,
        canActivate: [AuthGuardService]
        
    },
    {
        path: 'model-financeiro',
        component: ModelFinanceiroComponent,
        canActivate: [AuthGuardService]
        
    },
    {
        path: 'lista-financeiro',
        component: ListaFinanceiroComponent,
        canActivate: [AuthGuardService]
        
    },
    {
        path: 'calendario',
        component: CalendarioComponent,
        canActivate: [AuthGuardService]
        
    }
];
