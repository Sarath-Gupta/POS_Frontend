import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateOrderComponent } from '../create-order/create-order';
import { OrderListComponent } from '../order-list/order-list';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, CreateOrderComponent,OrderListComponent],
  templateUrl: './orders-page.html',
})
export class OrdersPageComponent {

}

