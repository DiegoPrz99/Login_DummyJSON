import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products$ = new BehaviorSubject<Product[]>([]);
  products$ = this._products$.asObservable();

  constructor(private http: HttpClient) {}

  loadProducts() {
    return this.http.get<any>('https://dummyjson.com/products').pipe(
      map(res => res.products || []),
      tap((ps: Product[]) => this._products$.next(ps)),
      catchError(err => {
        console.error('loadProducts', err);
        return of([]);
      })
    );
  }

  addProduct(product: Partial<Product>) {
    return this.http.post<Product>('https://dummyjson.com/products/add', product).pipe(
      tap(newProduct => {
        this._products$.next([newProduct, ...this._products$.value]);
      })
    );
  }

  createProduct(payload: Partial<Product>) {
    return this.http.post('https://dummyjson.com/products/add', payload).pipe(
      tap((created: any) => {
        const current = this._products$.getValue();
        this._products$.next([created, ...current]);
      })
    );
  }

  updateProduct(id: number, payload: Partial<Product>) {
    return this.http.patch(`https://dummyjson.com/products/${id}`, payload).pipe(
      tap((updated: any) => {
        const list = this._products$.getValue().map(p => p.id === id ? updated : p);
        this._products$.next(list);
      })
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`https://dummyjson.com/products/${id}`).pipe(
      tap(() => {
        this._products$.next(this._products$.getValue().filter(p => p.id !== id));
      }),
      catchError(err => {
        console.error('delete', err);
        return of(null);
      })
    );
  }
}
