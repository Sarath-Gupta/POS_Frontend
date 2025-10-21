import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/orders';
import { NotificationService } from '../../services/notification';
import { Order } from '../../models/order';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  searchTerm: string = '';

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Order>) => {
        this.orders = response.content;
        this.filteredOrders = response.content;
        this.totalPages = response.totalPages;
        console.log(this.orders);
      },
      error: (err) => this.notificationService.showError(err, 'Failed to Load Orders'),
    });
  }

  applyFilters(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.id.toString().includes(lowerCaseSearchTerm) ||
      order.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  printInvoice(orderId: number): void {
    this.orderService.downloadInvoice(orderId).subscribe({
      next: (response) => {
        // ## FIX #1: Look for 'base64Pdf' to match your backend response ##
        const base64String = response.base64Pdf; 

        if (!base64String) {
          this.notificationService.showError('Invoice data not found in the server response.', 'Download Failed');
          this.loadOrders(); // Still reload orders even if download fails, to show status change
          return;
        }

        // Decode the Base64 string
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create a temporary URL to trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-order-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        a.remove();
        
        this.notificationService.showSuccess('Invoice download started!');

        // ## FIX #2: Reload the orders to show the "Invoiced" status ##
        this.loadOrders(); 
      },
      error: (err) => this.notificationService.showError(err, 'Invoice Download Failed'),
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Order #${orderId} has been canceled.`);
          this.loadOrders(); // Refresh the list to show the updated status
        },
        error: (err) => this.notificationService.showError(err, 'Failed to Cancel Order'),
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'invoiced':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'canceled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}

