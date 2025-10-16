import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ClientService } from '../services/client';
import { Client } from '../models/client';
import { NotificationService } from '../services/notification';
import { PaginatedResponse } from '../models/paginatedResponse';

declare var bootstrap: any;

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
})
export class ClientListComponent implements OnInit {
  // Component State
  clients: Client[] = [];
  filteredClients: Client[] = [];
  clientForm!: FormGroup;
  selectedClient: Client | null = null;
  isEditMode = false;
  private clientModal: any;
  searchTerm: string = '';
  currentPage: number = 0;
  pageSize: number = 10; // As per your requirement
  totalPages: number = 0;

  @ViewChild('clientModal') clientModalElement!: ElementRef;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    this.clientModal = new bootstrap.Modal(this.clientModalElement.nativeElement);
  }

  loadClients(): void {
    this.clientService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Client>) => {
        this.clients = response.content;
        this.totalPages = response.totalPages;
        this.applyFilters(); // <-- Call this to update the filteredClients array
      },
      error: (err) => this.notificationService.showError(err, 'Failed to Load Clients'),
    });
  }

  /**
   * ### NEW method to handle clicks on the pagination controls.
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  applyFilters(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.clientName.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    // Call the service to upload the file
    this.clientService.uploadTsv(file).subscribe({
      next: () => {
        this.notificationService.showSuccess('Client TSV file uploaded successfully!');
        this.loadClients(); // Refresh the list to show new clients
      },
      error: (err) => this.notificationService.showError(err, 'File Upload Failed'),
    });
    
    // Reset the file input so the user can upload the same file again if needed
    event.target.value = '';
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedClient = null;
    this.clientForm.reset();
    this.clientModal.show();
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.selectedClient = client;
    this.clientForm.setValue({ clientName: client.clientName });
    this.clientModal.show();
  }

  saveClient(): void {
    // ... (save client logic remains the same)
    if (this.clientForm.invalid) {
      this.notificationService.showError('Client name is required.', 'Invalid Form');
      return;
    }

    if (this.isEditMode && this.selectedClient?.id) {
      const updatedClient: Client = { ...this.selectedClient, ...this.clientForm.value };
      this.clientService.update(this.selectedClient.id, updatedClient).subscribe({
        next: () => {
          this.notificationService.showSuccess('Client updated successfully!');
          this.loadClients();
          this.clientModal.hide();
        },
        error: (err) => this.notificationService.showError(err),
      });
    } else {
      this.clientService.add(this.clientForm.value).subscribe({
        next: (client) => {
          this.notificationService.showSuccess('Client added successfully!');
          this.clients.push(client);
          this.applyFilters();
          this.clientModal.hide();
        },
        error: (err) => this.notificationService.showError(err),
      });
    }
  }
}

