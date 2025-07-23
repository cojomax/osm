import { inject, Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { StoreConverter } from '../api/firebase/converter.interface';
import { CompetitionConverter } from '../api/firebase/converters/competition.converter';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { Competition } from '../api/models/competition.model';
import { AppCache } from './app-cache';
import { Repository } from './repository.interface';

const COLLECTION = FireStoreCollection.Competitions;

@Injectable({
  providedIn: 'root',
})
export class CompetitionService implements Repository<Competition> {
  private readonly converter: StoreConverter<Competition>;

  private readonly cache = inject(AppCache);
  private readonly dbSvc = inject(FirebaseDbService);

  constructor() {
    this.converter = new CompetitionConverter();
  }

  fetch() {
    return this.cache.competitions().length
      ? of(this.cache.competitions())
      : this.dbSvc.getCollection<Competition>(COLLECTION, this.converter).pipe(
          tap((competitions) => {
            this.cache.competitions.set(competitions);
          }),
        );
  }

  find(matchId: string) {
    return this.dbSvc.getDocuments<Competition>(COLLECTION, matchId, this.converter);
  }

  create(match: Competition) {
    return this.dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Competition) {
    return this.dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this.dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
