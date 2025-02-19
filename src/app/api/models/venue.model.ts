import { Entity } from './entity.interface';

export class Venue implements Entity {
  constructor(init: Partial<Venue>) {
    Object.assign(this, init);
  }

  id = '';

  /** The name of the venue. */
  name = '';
}
