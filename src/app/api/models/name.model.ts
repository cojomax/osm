import { Entity } from './entity.interface';

export class Name implements Entity {
  constructor(init: Partial<Name>) {
    Object.assign(this, init);
  }

  id = '';

  /** The name of the venue. */
  name = '';
}
