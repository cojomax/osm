import { inject, Injectable } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { StoreConverter } from '../api/firebase/converter.interface';
import { SeasonConverter } from '../api/firebase/converters/season.converter';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { Season } from '../api/models/season.model';
import { AppCache } from './app-cache';
import { Repository } from './repository.interface';

const COLLECTION = FireStoreCollection.Seasons;

@Injectable({
  providedIn: 'root',
})
export class SeasonService implements Repository<Season> {
  private readonly converter: StoreConverter<Season>;

  private readonly state = inject(AppCache);
  private readonly dbSvc = inject(FirebaseDbService);

  constructor() {
    this.converter = new SeasonConverter();
  }

  fetch() {
    return this.state.seasons().length
      ? of(this.state.seasons())
      : this.dbSvc.getCollection<Season>(COLLECTION, this.converter).pipe(
          map((res) => res.toSorted((a, b) => (a.startDate!.getTime() < b.startDate!.getTime() ? 1 : -1))),
          tap((res) => {
            this.state.seasons.set(res);
          }),
        );
  }

  find(matchId: string) {
    return this.dbSvc.getDocuments<Season>(COLLECTION, matchId, this.converter);
  }

  create(match: Season) {
    return this.dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Season) {
    return this.dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this.dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
