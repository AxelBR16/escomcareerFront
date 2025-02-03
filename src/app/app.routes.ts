import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { LoginComponent } from './components/login/login.component';
import { LogineComponent } from './components/logine/logine.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';
import { CuestionarioComponent } from './components/cuestionario/cuestionario.component';
import { PruebasAComponent } from './components/pruebas-a/pruebas-a.component';
import { ValoraComponent } from './components/valora/valora.component';
export const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'carreras', component: CarrerasComponent},
  {path: 'logine', component: LogineComponent},
  {path: 'login', component: LoginComponent},
  { path: 'instrucciones/:tipo', component: InstruccionesComponent },
  {path: 'cuestionario', component: CuestionarioComponent},
  {path: 'pruebasA', component: PruebasAComponent},
  {path: 'valora', component: ValoraComponent},
  { path: '**', redirectTo: '', pathMatch:'full'},
];
