import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { ClientListComponent } from './client-list/client-list';
import { ProductListComponent } from './product-list/product-list';
import { AuthGuard } from './guards/auth-guard';

// ## 1. IMPORT THE PARENT ORDERS PAGE COMPONENT ##
import { OrdersPageComponent } from './orders/orders-page/orders-page';


export const routes: Routes = [
  // ## AUTHENTICATION ROUTES ##
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },

  // ## MAIN APPLICATION ROUTES ##
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'clients', component: ClientListComponent },
      { path: 'products', component: ProductListComponent },
      
      // ## 2. CORRECTED ORDER ROUTE ##
      // This single route now points to your parent component, which contains both the form and the list.
      { path: 'orders', component: OrdersPageComponent },
      
      // Default page for the main application section
      { path: '', redirectTo: 'clients', pathMatch: 'full' } 
    ]
  },

  // ## TOP-LEVEL REDIRECTS ##
  { path: '', redirectTo: '/main/clients', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

