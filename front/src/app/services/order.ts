import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';

const BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class Order {
  constructor(private http: HttpClient, private auth: Auth) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  createOrder(customerEmail: string, items: { productId: string; quantity: number; price: number }[]) {
    return this.http.post<any>(`${BASE}/orders`, { customerEmail, items }, { headers: this.headers() });
  }

  registerUser(email: string, name: string, password: string, role: string) {
    return this.http.post<any>(`${BASE}/auth/register`, { email, name, password, role });
  }

  changeStatus(orderId: string, status: string) {
    return this.http.post<any>(`${BASE}/orders/${orderId}/status`, { status }, { headers: this.headers() });
  }
}
