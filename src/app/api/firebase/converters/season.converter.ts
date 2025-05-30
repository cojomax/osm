import { StoreConverter } from '../converter.interface';
import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { Season } from '../../models/season.model';

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
      league: { competitionId: comp['league']['competitionId'] },
      cup: { competitionId: comp['cup']['competitionId'] },
      startDate: new Date(comp['startDate']),
      endDate: new Date(comp['endDate']),
    });
  }
}
