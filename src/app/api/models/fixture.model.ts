import { Goal } from './goal.model';
import { Entity } from './entity.interface';
import { Competition } from './competition.model';
import { Name } from './name.model';

export class Fixture implements Entity {
  constructor(init: Partial<Fixture>) {
    Object.assign(this, init);
  }

  id = '';

  season: Name | null = null;

  /** The date the match is played on. */
  date: Date | null = null; // TODO Read model

  time: Date | null = null; // TODO Read model

  venue: Name | null = null;

  /** Details of the competition for which the fixture is scheduled. */
  competition: Competition | null = null;

  opponent: Name | null = null;

  homeGoals = 0;

  opponentGoals = 0;

  forfeit = false;

  goals: Goal[] = [];

  /** The ID of the player voted man of the match. */
  manOfMatch: string | null = null;

  /** The ID of the player voted dick of the day. */
  dunceOfDay: string | null = null;

  /** The ID of the match report. */
  matchReport: string | null = null;
}
