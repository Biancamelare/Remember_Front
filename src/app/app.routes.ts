import { Routes } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { CadastroUsuarioComponent } from './home/cadastro-usuario/cadastro-usuario.component';
import { RedefinirSenhaComponent } from './home/redefinir-senha/redefinir-senha.component';
import { SenhaComponent } from './home/senha/senha.component';

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
    }
];
