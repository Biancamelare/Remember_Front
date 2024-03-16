import { Routes } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { CadastroUsuarioComponent } from './home/cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'cadastro',
        component: CadastroUsuarioComponent
    }
];
