import { StoreConverter } from '../converter.interface';

export class SimpleConverter implements StoreConverter<{ id: string; name: string }> {
  toFirestore(item: { name: string }) {
    return {
      date: item.name,
    };
  }

  fromFirestore(snapshot: any): { id: string; name: string } {
    const datum = snapshot.data();
    return {
      id: snapshot.id,
      name: datum['name'],
    };
  }
}
