import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-loading-inicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-inicio.component.html',
  styleUrl: './loading-inicio.component.css'
})
export class LoadingInicioComponent {
  @Output() finishedLoading = new EventEmitter<void>(); // Evento para notificar cuando la carga haya terminado

  ngOnInit() {
    setTimeout(() => {
      this.finishedLoading.emit(); // Emitir el evento después de 3 segundos
    }, 3000);
  }
}
