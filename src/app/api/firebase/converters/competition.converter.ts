import { StoreConverter } from '../converter.interface';
import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { Competition } from '../../models/competition.model';

export class CompetitionConverter implements StoreConverter<Competition> {
  toFirestore(comp: Competition) {
    return {
      name: comp.name,
      tier: comp.tier,
      format: comp.format,
    };
  }

  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const comp = snapshot.data();
    return new Competition({
      id: snapshot.id,
      name: comp['name'],
      tier: comp['tier'],
      format: comp['format'],
      iteration: comp['iteration'],
    });
  }
}
