import { Entity } from './entity.interface';
import { Player } from './player.model';

export class Goal implements Entity {
  constructor(init: Goal) {
    Object.assign(this, init);
  }

  id = '';

  /** The player that scored the goal. */
  scored: Pick<Player, 'id' | 'firstName' | 'lastName'> | null = null;

  /** The player that assisted the goal, if any. */
  assisted: Pick<Player, 'id' | 'firstName' | 'lastName'> | null = null;

  minute: number | null = null;
}
