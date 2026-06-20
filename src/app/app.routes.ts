import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
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
