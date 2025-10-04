import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="app">
      <header class="header">
        <a routerLink="/" class="logo">Prueba Angular</a>
        <nav>
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/dashboard" routerLinkActive="active">Productos</a>
        </nav>
      </header>

      <main class="container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
