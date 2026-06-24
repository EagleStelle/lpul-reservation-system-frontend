import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page').then((m) => m.LandingPage),
  },
  {
    path: 'boardroom',
    loadComponent: () =>
      import('./boardroom/boardroom').then((m) => m.BoardroomReservation),
  },
];
