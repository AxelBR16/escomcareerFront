import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'carreras', component: CarrerasComponent},
  {path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '', pathMatch:'full'},
];
