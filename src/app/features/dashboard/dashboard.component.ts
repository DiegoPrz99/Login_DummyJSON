import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/auth.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user$ | async as user">
      <h2>Welcome {{ user.firstName }} {{ user.lastName }}</h2>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  user$: Observable<User | null> = this.authService.user$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
