import { Team } from './team.model';
import { Goal } from './goal.model';
import { DomainItem } from './domain-item.interface';

export class Match implements DomainItem {
  constructor(init: Partial<Match>) {
    Object.assign(this, init);
  }

  id = '';

  /** The date the match is played on. */
  date: Date | null = null;

  time: Date | null = null;

  venue: string | null = null;

  /**
   * The name of the competition for which the match is scheduled.
   */
  competition = '';

  opponent: Team | null = null;

  homeScore: number | null = null;

  opponentScore: number | null = null;

  goals: Goal[] = [];

  /** The ID of the player voted man of the match. */
  manOfMatch: string | null = null;

  /** The ID of the player voted dick of the day. */
  dickOfDay: string | null = null;

  /** The ID of the match report. */
  matchReport: string | null = null;

  /** The name of the division (if the competition is a league). */
  division: string | undefined;

  /** The week (league) or round (cup) number of the match. */
  round: string | undefined;
}
