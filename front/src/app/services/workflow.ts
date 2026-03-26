import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';

const BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class Workflow {
  constructor(private http: HttpClient, private auth: Auth) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll() {
    return this.http.get<any[]>(`${BASE}/workflows`, { headers: this.headers() });
  }

  create(name: string, trigger: string) {
    return this.http.post<any>(`${BASE}/workflows`, { name, trigger }, { headers: this.headers() });
  }

  toggle(id: string) {
    return this.http.patch<any>(`${BASE}/workflows/${id}/toggle`, {}, { headers: this.headers() });
  }

  triggerManual(id: string) {
    return this.http.post<any>(`${BASE}/workflows/${id}/trigger`, {}, { headers: this.headers() });
  }

  addAction(workflowId: string, type: string, order: number) {
    return this.http.post<any>(`${BASE}/workflows/${workflowId}/actions`, { type, order }, { headers: this.headers() });
  }

  getExecutions(workflowId: string) {
    return this.http.get<any[]>(`${BASE}/workflows/${workflowId}/executions`, { headers: this.headers() });
  }

  getTasks() {
    return this.http.get<any[]>(`${BASE}/tasks`, { headers: this.headers() });
  }
}
