import { AdminGuard } from './shared/guards/admin.guard';
import { AspiranteGuard } from './shared/guards/aspirante.guard';
import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { LoginComponent } from './components/login/login.component';
import { LogineComponent } from './components/logine/logine.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';
import { CuestionarioComponent } from './components/cuestionario/cuestionario.component';
import { PruebasAComponent } from './components/pruebas-a/pruebas-a.component';
import { ValoraComponent } from './components/valora/valora.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EgresadoDashboardComponent } from './components/egresado-dashboard/egresado-dashboard.component';
import { AspiranteDashboardComponent } from './components/aspirante-dashboard/aspirante-dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EgresadoGuard } from './shared/guards/egresado.guard';
import { FooterComponent } from './components/footer/footer.component';

export const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'carreras', component: CarrerasComponent},
  {path: 'logine', component: LogineComponent},
  {path: 'login', component: LoginComponent},
  { path: 'instrucciones/:tipo', component: InstruccionesComponent, canActivate: [AspiranteGuard]},
  {path: 'cuestionario', component: CuestionarioComponent, canActivate: [AspiranteGuard]},
  {path: 'pruebasA', component: PruebasAComponent, canActivate: [AspiranteGuard]},
  {path: 'valora', component: ValoraComponent, canActivate: [AspiranteGuard]},
  { path: ':tipo/preguntas/:id', component: PreguntasComponent, canActivate: [AspiranteGuard]},
  //{path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: 'egresado-dashboard', component: EgresadoDashboardComponent, canActivate: [EgresadoGuard]},
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  {path: 'aspirante-dashboard', component: AspiranteDashboardComponent, canActivate: [AspiranteGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '', pathMatch:'full'},
];  
