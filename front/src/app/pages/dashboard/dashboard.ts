import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Workflow } from '../../services/workflow';
import { Order } from '../../services/order';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  workflows: any[] = [];
  executions: Record<string, any[]> = {};
  tasks: any[] = [];
  openWorkflows: Set<string> = new Set();

  // Créer workflow
  showCreateModal = false;
  newName = '';
  newTrigger = 'order.created';
  triggers = ['order.created', 'user.registered', 'manual.trigger', 'updated.status'];

  // Actions
  actionTypes = ['notify_admin', 'notify_user', 'create_log', 'create_task'];
  selectedActionType: Record<string, string> = {};
  selectedActionOrder: Record<string, number> = {};

  // Créer user
  showUserModal = false;
  userEmail = '';
  userName = '';
  userPassword = 'password123';
  userRole = 'merchant';

  // Créer commande
  showOrderModal = false;
  orderEmail = 'customer@test.com';
  orderItems = [{ productId: 'prod-001', quantity: 2, price: 49.99 }];

  toast = '';

  constructor(
    private workflowService: Workflow,
    private orderService: Order,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() { this.load(); this.loadTasks(); }

  load() {
    this.workflowService.getAll().subscribe(data => {
      this.workflows = data;
      data.forEach(w => {
        this.selectedActionType[w.id] = this.selectedActionType[w.id] || 'notify_admin';
        this.selectedActionOrder[w.id] = this.selectedActionOrder[w.id] || w.actions.length + 1;
        this.loadExecutions(w.id);
      });
    });
  }

  loadTasks() {
    this.workflowService.getTasks().subscribe(data => { this.tasks = data; });
  }

  loadExecutions(id: string) {
    this.workflowService.getExecutions(id).subscribe(data => {
      this.executions[id] = data;
    });
  }

  toggleOpen(id: string) {
    this.openWorkflows.has(id) ? this.openWorkflows.delete(id) : this.openWorkflows.add(id);
  }
  isOpen(id: string) { return this.openWorkflows.has(id); }

  createWorkflow() {
    if (!this.newName.trim()) return;
    this.workflowService.create(this.newName, this.newTrigger).subscribe(() => {
      this.showCreateModal = false;
      this.newName = '';
      this.showToast('Workflow créé !');
      this.load();
    });
  }

  toggle(w: any) {
    this.workflowService.toggle(w.id).subscribe(res => {
      w.isActive = res.isActive;
      this.showToast(`Workflow ${res.isActive ? 'activé' : 'désactivé'}`);
    });
  }

  triggerManual(w: any) {
    this.workflowService.triggerManual(w.id).subscribe({
      next: () => { this.showToast('Workflow déclenché !'); setTimeout(() => { this.loadExecutions(w.id); this.loadTasks(); }, 800); },
      error: (err) => this.showToast(err.error?.message || 'Erreur'),
    });
  }

  addAction(w: any) {
    const type = this.selectedActionType[w.id];
    const order = this.selectedActionOrder[w.id];
    this.workflowService.addAction(w.id, type, order).subscribe(() => {
      this.showToast(`Action ${type} ajoutée !`);
      this.load();
    });
  }

  // Créer user → déclenche user.registered
  createUser() {
    if (!this.userEmail || !this.userName) return;
    this.orderService.registerUser(this.userEmail, this.userName, this.userPassword, this.userRole).subscribe({
      next: () => {
        this.showUserModal = false;
        this.showToast('Utilisateur créé → user.registered déclenché !');
        setTimeout(() => { this.load(); this.loadTasks(); }, 1000);
      },
      error: (err) => this.showToast(err.error?.message || 'Erreur création user'),
    });
  }

  // Créer commande → déclenche order.created
  createOrder() {
    if (!this.orderEmail) return;
    this.orderService.createOrder(this.orderEmail, this.orderItems).subscribe({
      next: () => {
        this.showOrderModal = false;
        this.showToast('Commande créée → order.created déclenché !');
        setTimeout(() => { this.load(); this.loadTasks(); }, 1000);
      },
      error: (err) => this.showToast(err.error?.message || 'Erreur création commande'),
    });
  }

  addItem() {
    this.orderItems.push({ productId: '', quantity: 1, price: 0 });
  }

  removeItem(i: number) {
    this.orderItems.splice(i, 1);
  }

  logout() { this.auth.logout(); this.router.navigate(['/login']); }

  showToast(msg: string) {
    this.toast = msg;
    setTimeout(() => this.toast = '', 3000);
  }
}
