export class Player {
  constructor(init: Partial<Player>) {
    Object.assign(this, init);
  }

  playerId = '';

  /** The first name of the player. */
  firstName = '';

  /** The last name of the player. */
  lastName = '';

  /** The position the player ordinarily plays. */
  position = '';

  /** The squad number with which the player plays. */
  squadNumber = 0;
}
