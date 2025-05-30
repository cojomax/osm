import { Entity } from './entity.interface';

export class Season implements Entity {
  constructor(init: Season) {
    Object.assign(this, init);
  }

  /** The ID to identify the record. */
  id = '';

  /** The name of this season. */
  name = '';

  league: { competitionId: string } | null = null;

  cup: { competitionId: string } | null = null;

  startDate: Date | null = null;

  endDate: Date | null = null;
}
