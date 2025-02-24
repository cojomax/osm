import { StoreConverter } from '../converter.interface';
import { Fixture } from '../../models/fixture.model';

export class FixtureConverter implements StoreConverter<Fixture> {
  toFirestore(fixture: Fixture) {
    return {
      date: fixture.date,
      time: fixture.time,
      venue: this.toPojo(fixture.venue),
      competition: this.toPojo(fixture.competition),
      opponent: this.toPojo(fixture.opponent),
    };
  }

  fromFirestore(snapshot: any): Fixture {
    const match = snapshot.data();
    return new Fixture({
      id: snapshot.id,
      date: match['date']?.toDate(),
      time: match['time']?.toDate(),
      venue: match['venue'],
      competition: match['competition'],
      opponent: match['opponent'],
    });
  }

  private toPojo<T>(obj: T | null) {
    if (!obj) {
      return null;
    }

    const pojo = Object.create(null);

    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        pojo[key] = obj[key as keyof T] ?? null;
      }
    });

    return pojo as T;
  }
}
