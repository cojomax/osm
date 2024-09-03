import { Player } from './player.model';

export class Goal {
  constructor(init: Partial<Goal>) {
    Object.assign(this, init);
  }

  /** The player that scored the goal. */
  scorer: Player | null = null;

  /** The player that assisted the goal, if any. */
  assist: Player | null = null;
}
