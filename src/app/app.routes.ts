import { Routes } from '@angular/router';
import { ClientListComponent } from './client/client-list/client-list';
import { ProductListComponent } from './product-list/product-list';

export const routes: Routes = [
    {path: 'clients', component: ClientListComponent},
    {path: 'products', component: ProductListComponent}
];
