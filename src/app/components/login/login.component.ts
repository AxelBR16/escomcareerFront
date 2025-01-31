import { Component } from '@angular/core';
import { CargarScriptsService } from '../../services/cargar-scripts.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor( private _CargarScripts:CargarScriptsService){
    _CargarScripts.Carga(["js/login.js"]);
  }
}
