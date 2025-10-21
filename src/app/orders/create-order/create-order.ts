import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/orders';
import { NotificationService } from '../../services/notification';
import { OrderItemForm } from '../../models/order-item'; // Create this interface


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-order.html',
  styleUrls: ['./create-order.css']
})
export class CreateOrderComponent {
  orderItemForm: FormGroup;
  currentOrderItems: OrderItemForm[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {
    // ## THIS IS THE MAIN CHANGE ##
    this.orderItemForm = this.fb.group({
      productId: [null, [Validators.required, Validators.min(1)]], // Changed from 'barcode'
      quantity: [1, [Validators.required, Validators.min(1)]],
      sellingPrice: [null, [Validators.required, Validators.min(0)]]
    });
  }

  addItemToOrder(): void {
    if (this.orderItemForm.invalid) {
      this.notificationService.showError('Please provide a valid Product ID, quantity, and price.', 'Invalid Item');
      return;
    }
    
    this.currentOrderItems.unshift(this.orderItemForm.value);
    
    this.orderItemForm.reset({
      productId: null,
      quantity: 1,
      sellingPrice: this.orderItemForm.value.sellingPrice
    });
  }

  removeItem(index: number): void {
    this.currentOrderItems.splice(index, 1);
  }

  getTotal(): number {
    return this.currentOrderItems.reduce((total, item) => total + (item.quantity * item.sellingPrice), 0);
  }

  placeOrder(): void {
    if (this.currentOrderItems.length === 0) {
      this.notificationService.showError('Cannot place an empty order.', 'Order Error');
      return;
    }

    this.orderService.createOrder(this.currentOrderItems).subscribe({
      next: () => {
        this.notificationService.showSuccess('Order placed successfully!');
        this.currentOrderItems = [];
        this.orderItemForm.reset({ quantity: 1 });
      },
      error: (err) => this.notificationService.showError(err, 'Order Failed')
    });
  }
}

