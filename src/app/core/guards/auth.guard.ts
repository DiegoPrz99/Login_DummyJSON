import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token) {
    return true; // Si hay token → deja pasar
  }

  alert('Debes iniciar sesión para acceder al Dashboard');
  return router.createUrlTree(['/login']);
};
