import { Routes } from '@angular/router';
import { LoginComponent } from './home/components/login/login.component';
import { CadastroUsuarioComponent } from './home/components/cadastro-usuario/cadastro-usuario.component';
import { RedefinirSenhaComponent } from './home/components/redefinir-senha/redefinir-senha.component';
import { SenhaComponent } from './home/components/senha/senha.component';
import { ConfiguracoesComponent } from './home/components/configuracoes/configuracoes.component';
import { VisualizarTarefasComponent } from './tarefa/visualizar-tarefas/visualizar-tarefas.component';
import { ModalComponent } from './tarefa/modal/modal.component';


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
        component: ConfiguracoesComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'redefinir-senha',
        component: RedefinirSenhaComponent
    },
    {
        path: 'senha',
        component: SenhaComponent
    },
    {
        path: 'visualizar-tarefas',
        component: VisualizarTarefasComponent
    },
    {
        path: 'modal',
        component: ModalComponent
    }
];
