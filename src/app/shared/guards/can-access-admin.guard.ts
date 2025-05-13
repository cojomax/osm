import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { SESSION } from '../../services/tokens/session.token';

export const canAccessAdmin: CanMatchFn = () => {
  const session = inject(SESSION);
  return (session.isActive && session.firebaseUser?.uid === 'smBGmW6JGWbr0I7yIYzCmkXpIDa2') ?? false;
};
