import { Entity } from '../../api/models/entity.interface';

export function compareByIdFn(a: Entity, b: Entity) {
  return a && b ? a.id === b.id : a === b;
}
