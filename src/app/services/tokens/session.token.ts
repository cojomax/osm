import { InjectionToken } from '@angular/core';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../models/user.model';

export const sessionFactory = () => new Session();

export class Session {
  constructor(
    public firebaseUser: FirebaseUser | null = null,
    public user: User | null = null,
  ) {}

  get isActive() {
    return this.firebaseUser || this.user;
  }
}

export const SESSION = new InjectionToken<Session>('app-session');
