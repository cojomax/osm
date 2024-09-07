export class Assist {
  constructor(init: Partial<Assist>) {
    Object.assign(this, init);
  }

  /** An identification for this assit. */
  assistId = '';

  /** The ID of the player that provided the assist. */
  playerId = '';

  /** An ID of the goal that resulted from the assist. */
  goalId = '';
}
