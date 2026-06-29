import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

export const homeRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const userState = inject(UserStateService);

  // localStorage n'existe pas côté serveur (SSR) → on protège l'accès
  if (isPlatformBrowser(platformId)) {
    const id = userState.getSavedUserId();
    if (id) {
      return router.createUrlTree(['/chat', id]);
    }
  }
  return router.createUrlTree(['/onboarding']);
};