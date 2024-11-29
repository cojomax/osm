export class Team {
  constructor(init: Team) {
    Object.assign(this, init);
  }

  /** The id of the team. */
  teamId = '';

  /** The name of the team. */
  name: string | null = null;
}
