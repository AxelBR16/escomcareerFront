import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { Testimonio } from '../../models/testimonio.model';
import { TestimonioService } from '../../services/testimonio.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  testimonios: Testimonio[] = [];

  constructor(private testimonioService: TestimonioService) {}

  ngOnInit() {
    // Recuperamos los testimonios desde el servicio
    this.testimonios = this.testimonioService.getTestimonios();
  }

 // Variable que controla la visibilidad del texto
  isTextVisible: boolean = false;

  // Método que alterna la visibilidad del texto
  toggleTextVisibility(): void {
    this.isTextVisible = !this.isTextVisible;
  }

  
}