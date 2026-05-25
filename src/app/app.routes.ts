import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding').then(m => m.OnboardingPage),
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list').then(m => m.ListPage),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map').then(m => m.MapPage),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail').then(m => m.DetailPage),
  },
  { path: '**', redirectTo: 'onboarding' },
];
