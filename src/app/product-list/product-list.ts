import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/products';
import { Product } from '../models/products';

// This gives TypeScript access to the global bootstrap object
declare var bootstrap: any;

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
  private productModal: any;

  // Get a reference to the modal element in the template
  @ViewChild('productModal') productModalElement!: ElementRef;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      barcode: ['', Validators.required],
      clientId: ['', Validators.required],
      mrp: ['', [Validators.required, Validators.min(0)]],
      imgUrl: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    // Initialize the Bootstrap modal once the view is ready
    this.productModal = new bootstrap.Modal(this.productModalElement.nativeElement);
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }

  // Method to open the modal
  openAddModal(): void {
    this.productForm.reset(); // Clear the form before showing
    this.productModal.show();
  }

  addProduct(): void {
    if (this.productForm.invalid) return;

    const newProduct: Product = this.productForm.value;
    this.productService.add(newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.productModal.hide(); // Hide the modal on success
      },
      error: (err) => console.error('Error adding product', err),
    });
  }

  getProductById(): void {
    // This function remains unchanged
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