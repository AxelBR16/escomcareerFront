import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { LoginComponent } from './components/login/login.component';
import { LogineComponent } from './components/logine/logine.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';

export const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'carreras', component: CarrerasComponent},
  {path: 'logine', component: LogineComponent},
  {path: 'login', component: LoginComponent},
  {path: 'instrucciones', component: InstruccionesComponent},
  { path: '**', redirectTo: '', pathMatch:'full'},
];
