import { Goal } from './goal.model';
import { Match } from './match.model';
import { Opposition } from './opposition.model';
import { Player } from './player.model';

export class MatchReport {
  constructor(init?: Partial<MatchReport>) {
    Object.assign(this, init);
  }

  /** Details about the scheduled match. */
  match: Match | null = null;

  /** Details about the opposition. */
  opposition: Opposition | null = null;

  /** A list of goals scored by Old Speckled Men. */
  goals: Goal[] = [];

  /** Were Old Speckled Men the home team. */
  isHome = false;

  /** The player voted Man of the Match by the club. */
  manOfTheMatch: Player | null = null;

  /** The player voted Dick of the Day by the club. */
  dickOfTheDay: Player | null = null;
}
