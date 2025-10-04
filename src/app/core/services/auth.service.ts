import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { LoginRequest, User } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'demo_token';
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.fetchProfile().subscribe();
    }
  }

  login(body: LoginRequest) {
    return this.http.post<any>('https://dummyjson.com/auth/login', body).pipe(
      tap((res) => {
        if (res && res.accessToken) {
          localStorage.setItem(this.tokenKey, res.accessToken);
          this._user$.next(res);
        }
      }),
      catchError(err => {
        console.error('Login error', err);
        throw err;
      })
    );
  }

  fetchProfile() {
    const token = this.getToken();
    if (!token) return of(null);

    return this.http.get<User>('https://dummyjson.com/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(user => this._user$.next(user)),
      catchError(err => {
        console.error('fetchProfile', err);
        this.logout();
        return of(null);
      })
    );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._user$.next(null);
  }
}
