export class Goal {
  constructor(init: Partial<Goal>) {
    Object.assign(this, init);
  }

  goalId = '';

  matchId = '';

  /** The ID of the player that scored the goal. */
  playerId = '';

  /** The ID of the player that assisted the goal, if any. */
  assistId = '';
}
