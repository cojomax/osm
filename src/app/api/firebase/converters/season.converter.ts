import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
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
      league: { competitionId: comp['league']['competitionId'], position: comp['league']['position'] },
      cup: { competitionId: comp['cup']['competitionId'] },
      startDate: new Date(comp['startDate']),
      endDate: new Date(comp['endDate']),
    });
  }
}
