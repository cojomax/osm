import { CompetitionAggregate } from './competition-aggregate.model';
import { Entity } from './entity.interface';

export class Season implements Entity {
  constructor(init: Pick<Season, 'id' | 'name' | 'competitions' | 'startDate' | 'endDate' | 'active'>) {
    Object.assign(this, init);
  }

  /** The ID to identify the record. */
  id = '';

  /** The name of this season. */
  name = '';

  competitions: CompetitionAggregate[] = [];

  startDate: Date | null = null;

  endDate: Date | null = null;

  active = false;

  get league() {
    return this.competitions.find((c) => c.isLeague);
  }
}
