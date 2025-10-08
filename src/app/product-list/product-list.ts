import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/products';
import { Product } from '../models/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  productId!: number;
  selectedProduct?: Product;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }

  addProduct(): void {
    if (this.productForm.invalid) return;

    const newProduct: Product = this.productForm.value;
    this.productService.add(newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.productForm.reset();
      },
      error: (err) => console.error('Error adding product', err),
    });
  }

  getProductById(): void {
    if (!this.productId) return;

    this.productService.getById(this.productId).subscribe({
      next: (product) => (this.selectedProduct = product),
      error: (err) => {
        console.error(err);
        this.selectedProduct = undefined;
      },
    });
  }
}
