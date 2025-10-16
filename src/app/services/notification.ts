import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  showError(error: any, title: string = 'An Error Occurred'): void {
    // This logic finds the specific backend message
    const message = error.error?.message   // <-- 1. Check for the backend's JSON message
                   || error.message       // <-- 2. Fallback to the generic HTTP message
                   || 'An unknown error occurred.'; // <-- 3. Final fallback

    this.toastr.error(message, title);
  }
}