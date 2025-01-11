import { DomainItem } from './domain-item.interface';

export class Team implements DomainItem {
  constructor(init: Team) {
    Object.assign(this, init);
  }

  /** The id of the team. */
  id = '';

  /** The name of the team. */
  name: string | null = null;
}
