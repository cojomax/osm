import { Position } from '../../models/position.enum';
import { DomainItem } from './domain-item.interface';

export class Player implements DomainItem {
  constructor(init: Partial<Player>) {
    Object.assign(this, init);
  }

  id = '';

  /** The first name of the player. */
  firstName = '';

  /** The last name of the player. */
  lastName = '';

  /** The position the player ordinarily plays. */
  position = Position.Undefined;

  /** The squad number with which the player plays. */
  squadNumber = 0;

  /** The home nation from which the player originates. */
  country = '';

  /** The date of birth of the player. */
  dob: Date | null = null;

  /** The player's height (cm). */
  height: number | null = null;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
