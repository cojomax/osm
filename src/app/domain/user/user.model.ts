export class User {
  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  id = '';

  username = '';

  email = '';

  role = UserRole.undefined;

  get isAdmin() {
    return this.role === UserRole.god || this.role === UserRole.manager;
  }
}

export enum UserRole {
  /** There is only one. */
  god = 'God',
  /** A registered OSM manager. */
  manager = 'Manager',
  /** A registered OSM player. */
  player = 'Player',
  /** Everyone else, like public, with read-only privileges. */
  undefined = 'Undefined',
}
