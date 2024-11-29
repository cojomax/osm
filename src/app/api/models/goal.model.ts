export class Goal {
  constructor(init: Goal) {
    Object.assign(this, init);
  }

  goalId = '';

  /** The ID of the player that scored the goal. */
  scorer = '';

  /** The ID of the player that assisted the goal, if any. */
  assisted: string | undefined;
}
