import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client';
import { Client } from '../../models/client';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.html',
  standalone: true,          // <-- indicates a standalone component
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule], // <-- must include HttpClientModule
  providers: [ClientService], // optional if service not providedIn root
})

export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  clientForm! : FormGroup;
  clientId! : number;
  selectedClient?: Client;

  constructor(private clientService: ClientService, private fb : FormBuilder) {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error(err),
    });
  }

  getClientById(): void {
    if (!this.clientId) return;

    this.clientService.getById(this.clientId).subscribe({
      next: (client) => {
        this.selectedClient = client;
      },
      error: (err) => {
        console.error('Error fetching client', err);
        this.selectedClient = undefined;
      },
    });
  }

  addClient(): void {
    if (this.clientForm.invalid) return;

    const newClient: Client = this.clientForm.value;
    this.clientService.add(newClient).subscribe({
      next: (client) => {
        this.clients.push(client); // add to the table
        this.clientForm.reset();   // reset the form
      },
      error: (err) => console.error('Error adding client', err),
    });
  }

}
