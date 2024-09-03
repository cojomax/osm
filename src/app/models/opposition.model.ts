export class Opposition {
  constructor(init: Partial<Opposition>) {
    Object.assign(this, init);
  }

  /** The name of the opposition team for a match. */
  name = '';

  /** The number of goals the opposition team scored in the match. */
  goals = 0;
}
