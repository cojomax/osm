import { Entity } from './entity.interface';

export class Competition implements Entity {
  constructor(init: Competition) {
    Object.assign(this, init);
  }

  /** The ID to identify the record. */
  id = '';

  /** The name of this competition. */
  name = '';

  /** The level of this competition format. */
  tier: 'Cup' | 'Division 1' | 'Division 2' | 'Plate' | null = null;

  /** The type of this competition. */
  format: 'Cup' | 'Exhibition' | 'League' = 'League';

  /** The league match week number, or cup round. */
  iteration: string | null = null;
}
