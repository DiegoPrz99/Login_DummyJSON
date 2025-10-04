import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { Observable } from 'rxjs';
import { User } from '../../core/interfaces/auth.interface';
import { Product } from '../../core/interfaces/product.interface';
import { ProductsListComponent } from '../products/products-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductsListComponent],
  template: `
    <section class="dashboard">
      <div class="profile" *ngIf="user$ | async as user">
        <img class="avatar" [src]="'https://i.pravatar.cc/80?u=' + user.id" alt="avatar" />
        <div>
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
          <p>{{ user.email }}</p>
          <button (click)="logout()">Logout</button>
        </div>
      </div>

      <app-products-list></app-products-list>
    </section>
  `,
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private auth: AuthService, private productService: ProductService, private router: Router ) {}

  ngOnInit(): void {
    this.user$ = this.auth.user$;
    this.productService.loadProducts().subscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
