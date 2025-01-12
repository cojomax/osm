import { StoreConverter } from '../converter.interface';
import { Match } from '../../models/match.model';

export class FixtureConverter implements StoreConverter<Match> {
  toFirestore(match: Match) {
    return {
      date: match.date,
      time: match.time,
      venue: match.venue,
      competition: match.competition,
      opponent: match.opponent,
    };
  }

  fromFirestore(snapshot: any): Match {
    const match = snapshot.data();
    return new Match({
      id: snapshot.id,
      date: match['date']?.toDate(),
      time: match['time']?.toDate(),
      venue: match['venue'],
      competition: match['competition'],
      opponent: match['opponent'],
    });
  }
}
