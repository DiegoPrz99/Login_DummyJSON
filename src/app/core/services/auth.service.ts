import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://dummyjson.com';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`);
  }
}
