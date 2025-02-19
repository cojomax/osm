import { Team } from './team.model';
import { Goal } from './goal.model';
import { Entity } from './entity.interface';

export class Fixture implements Entity {
  constructor(init: Partial<Fixture>) {
    Object.assign(this, init);
  }

  id = '';

  /** The date the match is played on. */
  date: Date | null = null;
  // TODO Merge into one
  time: Date | null = null;

  venue: string | null = null;

  /** Details of the competition for which the fixture is scheduled. */
  // TODO Change this to an ID for Competition type.
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
}
