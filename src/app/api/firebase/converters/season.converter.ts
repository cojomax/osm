import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { CompetitionAggregate } from '../../models/competition-aggregate.model';
import { Season } from '../../models/season.model';
import { StoreConverter } from '../converter.interface';

export class SeasonConverter implements StoreConverter<Season> {
  toFirestore(comp: Season) {
    return {};
    // return {
    //   name: comp.name,
    //   tier: comp.tier,
    //   format: comp.format,
    // };
  }

  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const comp = snapshot.data();
    return new Season({
      id: snapshot.id,
      name: comp['name'],
      competitions: comp['competitions'].map((c: any) => new CompetitionAggregate(c)),
      startDate: new Date(comp['startDate']),
      endDate: new Date(comp['endDate']),
    });
  }
}
