import { Entity } from './entity.interface';

export class Competition implements Entity {
  /** The ID to identify the record. */
  id = '';

  /** The name of this competition. */
  name = '';

  /** The optional division, applicable to leagues. */
  division = '';

  /** The type of this competition. */
  type: 'League' | 'Cup' = 'League';

  /** The league match week number, or cup round. */
  iteration = '';
}
