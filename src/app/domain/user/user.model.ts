export class UserModel {
  id = '';
  name = '';
  email = '';
  role = UserRole.undefined;
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
