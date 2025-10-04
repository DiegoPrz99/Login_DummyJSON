import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../../core/interfaces/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list">
      <div class="toolbar">
        <h3>Products</h3>
        <div>
          <button (click)="refresh()">Refresh</button>
          <button (click)="showCreateForm = !showCreateForm">
            {{ showCreateForm ? 'Cancel' : 'Add Product' }}
          </button>
        </div>
      </div>

      <div *ngIf="showCreateForm || editing" class="form">
        <h4>{{ editing ? 'Edit Product' : 'New Product' }}</h4>
        <input [(ngModel)]="form.title" placeholder="Title" />
        <input [(ngModel)]="form.description" placeholder="Description" />
        <input [(ngModel)]="form.thumbnail" placeholder="Image URL" />
        <input [(ngModel)]="form.price" type="number" placeholder="Price" />

        <div class="form-actions">
          <button (click)="save()">
            {{ editing ? 'Update' : 'Create' }}
          </button>
          <button *ngIf="editing" (click)="cancelEdit()" class="cancel">
            Cancel
          </button>
        </div>
      </div>

      <ul>
        <li *ngFor="let p of products$ | async; trackBy: trackById">
          <img *ngIf="p.thumbnail" [src]="p.thumbnail" />
          <div class="meta">
            <strong>{{ p.title }}</strong>
            <p class="desc">{{ p.description }}</p>
            <p class="price">$ {{ p.price }}</p>
          </div>
          <div class="actions">
            <button (click)="edit(p)">Edit</button>
            <button (click)="delete(p.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {
  products$!: Observable<Product[]>;
  showCreateForm = false;
  editing: Product | null = null;
  form: Partial<Product> = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.refresh();
  }

  trackById(index: number, p: Product) { return p.id; }

  refresh() { this.productService.loadProducts().subscribe(); }

  edit(p: Product) {
    this.editing = p;
    this.form = { ...p };
  }

  save() {
    if (this.editing) {
      const payload = {
        title: this.form.title,
        description: this.form.description,
        price: this.form.price,
        thumbnail: this.form.thumbnail
      };
  
      this.productService.updateProduct(this.editing.id, payload).subscribe(() => {
        this.editing = null;
        this.form = {};
      });
    } else {
      this.productService.addProduct(this.form).subscribe(() => {
        this.showCreateForm = false;
        this.form = {};
      });
    }
  }  

  cancelEdit() {
    this.editing = null;
    this.form = {};
  }

  delete(id: number) { this.productService.deleteProduct(id).subscribe(); }
}
