import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { getIsoDate } from 'src/app/shared/utility/date.util';
import { CompetitionAggregate } from '../../models/competition-aggregate.model';
import { Competition } from '../../models/competition.model';
import { Season } from '../../models/season.model';
import { StoreConverter } from '../converter.interface';

export class SeasonConverter implements StoreConverter<Season> {
  toFirestore(season: Season) {
    const data = {
      name: season.name,
      active: season.active,
      startDate: getIsoDate(season.startDate),
      endDate: getIsoDate(season.endDate),
      // FIXME This is a hack to get the competitions to save.
      competitions: (season.competitions as unknown as Competition[]).map((c) => ({
        competitionId: c.id,
        name: c.name,
        tier: c.tier,
        format: c.format,
      })),
    };

    console.log(data);

    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const comp = snapshot.data();
    return new Season({
      id: snapshot.id,
      name: comp['name'],
      active: comp['active'],
      competitions: comp['competitions'].map((c: any) => new CompetitionAggregate(c)),
      startDate: new Date(comp['startDate']),
      endDate: comp['endDate'] ? new Date(comp['endDate']) : null,
    });
  }
}
