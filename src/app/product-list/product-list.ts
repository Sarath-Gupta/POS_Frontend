import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ProductService } from '../services/products';
import { Product } from '../models/products';
import { NotificationService } from '../services/notification';
import { PaginatedResponse } from '../models/paginatedResponse';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
})
export class ProductListComponent implements OnInit {
  // Component State
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productForm!: FormGroup;
  private productModal: any;
  
  // State for editing
  selectedProduct: Product | null = null;
  isEditMode = false;

  // State for filtering and pagination
  searchTerm: string = '';
  searchClientId: number | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  @ViewChild('productModal') productModalElement!: ElementRef;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
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
    this.productModal = new bootstrap.Modal(this.productModalElement.nativeElement);
  }

  loadProducts(): void {
    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.applyFilters();
      },
      error: (err) => this.notificationService.showError(err, 'Failed to Load Products'),
    });
  }

  applyFilters(): void {
    // ... (logic remains the same)
    let tempProducts = [...this.products];
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.barcode.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    if (this.searchClientId !== null && this.searchClientId !== undefined) {
      const clientId = Number(this.searchClientId);
      if (!isNaN(clientId)) {
        tempProducts = tempProducts.filter(product => product.clientId === clientId);
      }
    }
    this.filteredProducts = tempProducts;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  
  onFileSelected(event: any): void {
    // ... (logic remains the same)
  }

  /**
   * ### MODIFIED: Now enables barcode and clientId fields for adding.
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.productForm.reset();
    // Ensure controls are enabled for adding a new product
    this.productForm.get('barcode')?.enable();
    this.productForm.get('clientId')?.enable();
    this.productModal.show();
  }

  /**
   * ### MODIFIED: Now disables barcode and clientId fields for editing.
   */
  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm.setValue({
      name: product.name,
      barcode: product.barcode,
      clientId: product.clientId,
      mrp: product.mrp,
      imgUrl: product.imgUrl || ''
    });
    // Disable controls that should not be editable
    this.productForm.get('barcode')?.disable();
    this.productForm.get('clientId')?.disable();
    this.productModal.show();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.notificationService.showError('Please fill out all required fields.', 'Invalid Form');
      return;
    }

    if (this.isEditMode && this.selectedProduct?.id) {
      // GetRawValue() includes disabled fields, ensuring we have the full object
      const updatedProductData = this.productForm.getRawValue();
      const updatedProduct: Product = { ...this.selectedProduct, ...updatedProductData };
      
      this.productService.update(this.selectedProduct.id, updatedProduct).subscribe({
        next: () => {
          this.notificationService.showSuccess('Product updated successfully!');
          this.loadProducts();
          this.productModal.hide();
        },
        error: (err) => this.notificationService.showError(err),
      });
    } else {
      this.productService.add(this.productForm.value).subscribe({
        next: () => {
          this.notificationService.showSuccess('Product added successfully!');
          this.loadProducts();
          this.productModal.hide();
        },
        error: (err) => this.notificationService.showError(err),
      });
    }
  }
}

