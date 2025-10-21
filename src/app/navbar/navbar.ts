import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink,RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}