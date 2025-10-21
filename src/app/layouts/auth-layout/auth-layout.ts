import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // <-- It only needs the RouterOutlet
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.css']
})
export class AuthLayoutComponent {
  // This component has no logic.
}