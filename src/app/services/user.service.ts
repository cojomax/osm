import { Injectable } from '@angular/core';
import { User, UserRole } from '../domain/user/user.model';
import { UserState } from './user.state';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private state: UserState) {}

  setUserRoleTmp(role: UserRole) {
    if (!this.state.user) {
      return;
    }

    const _user = { ...this.state.user, role } as User;
    this.state.user = _user;
  }

  hasAdminAccess() {
    this.state.user?.isAdmin || false;
  }
}
