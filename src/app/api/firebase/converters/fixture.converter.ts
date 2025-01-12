import { StoreConverter } from '../converter.interface';
import { Fixture } from '../../models/fixture.model';

export class FixtureConverter implements StoreConverter<Fixture> {
  toFirestore(match: Fixture) {
    return {
      date: match.date,
      time: match.time,
      venue: match.venue,
      competition: match.competition,
      opponent: match.opponent,
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
}
