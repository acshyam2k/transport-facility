import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'find',
    pathMatch: 'full'
  },
  {
    path: 'find',
    loadComponent: () => import('./features/find-ride/find-ride.component').then(m => m.FindRideComponent)
  },
  {
    path: 'offer',
    loadComponent: () => import('./features/offer-ride/offer-ride.component').then(m => m.OfferRideComponent)
  }
];
