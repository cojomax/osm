export class Match {
  constructor(init: Partial<Match>) {
    Object.assign(this, init);
  }

  /** The date the match is played on. */
  date: Date | null = null;

  /** The time that the match kicks off. */
  kickoff: Date | null = null;

  /** The venue where the match is played. */
  venue = '';

  /**
   * The name of the competition for which the match is scheduled.
   * e.g.
   */
  competition = '';

  /** The name of the divisio (if the competition is a league). */
  division: string | null = null;

  /** The week (leageu) or round (cup) number of the match. */
  round: string | null = null;
}
