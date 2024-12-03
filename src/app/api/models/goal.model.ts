export class Goal {
  constructor(init: Goal) {
    Object.assign(this, init);
  }

  goalId = '';

  /** The ID of the player that scored the goal. */
  scoredBy = '';

  /** The ID of the player that assisted the goal, if any. */
  assistedBy: string | undefined;
}
