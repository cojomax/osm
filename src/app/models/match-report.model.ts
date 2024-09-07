import { Goal } from './goal.model';
import { Opposition } from './opposition.model';

export class MatchReport {
  constructor(init?: Partial<MatchReport>) {
    Object.assign(this, init);
  }

  matchReportId = '';

  /** The ID of the match for which this report was generated. */
  matchId = '';

  /** Details about the opposition. */
  opposition: Opposition | null = null;

  /** A list of goals scored by Old Speckled Men. */
  goals: Goal[] = [];

  /** Were Old Speckled Men the home team. */
  isHome = false;

  /** The ID of the player voted Man of the Match by the club. */
  manOfTheMatch = '';

  /** The ID of the player voted Dick of the Day by the club. */
  dickOfTheDay = '';
}
