import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

export const homeRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.parseUrl('/onboarding');
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [homeRedirectGuard],
    children: []          // route sans composant : le guard fait la redirection
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.component')
        .then(m => m.OnboardingComponent)
  },
  {
    path: 'chat/:userId',
    loadComponent: () =>
      import('./features/chat/chat.component')
        .then(m => m.ChatComponent)
  },
  {
    path: '**',
    redirectTo: 'onboarding'
  }
];