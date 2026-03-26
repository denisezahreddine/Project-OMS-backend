import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string }>(`${BASE}/auth/login`, { email, password }).pipe(
      tap(res => localStorage.setItem('token', res.accessToken))
    );
  }

  logout() { localStorage.removeItem('token'); }

  getToken() { return localStorage.getItem('token'); }

  isLoggedIn() { return !!this.getToken(); }
}
