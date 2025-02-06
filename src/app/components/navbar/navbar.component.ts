import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCarrerasRoute: boolean = false;
  isForgotRoute: boolean = false;
  isLoginRoute: boolean = false;

  showMenu: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCarrerasRoute = this.router.url.includes('/carreras');
        this.isForgotRoute = this.router.url.includes('/forgot-password');
        this.isLoginRoute = this.router.url.includes('/login');
      }
    });
  }

  // Alterna la visibilidad del menú en pantallas pequeñas
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
