import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Remove NavbarComponent from here
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // This component no longer needs any specific logic.
  // The 'title' signal can be removed if not used.
}