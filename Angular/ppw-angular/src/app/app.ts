import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from "./components/app-header/app-header";
import { AppHeroComponent } from './components/hero/app-hero';

@Component({
  selector: 'aplicacion',
  imports: [RouterOutlet, AppHeader, AppHeroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ppw-angular');

  isLoggedIn = false;

  materias = ['Programacion',
    'Estructura de datos',
    'DB'
  ];
}
