import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { Season } from '../api/models/season.model';
import { SeasonConverter } from '../api/firebase/converters/season.converter';

const COLLECTION = FireStoreCollection.Seasons;

@Injectable({
  providedIn: 'root',
})
export class SeasonService implements Repository<Season> {
  private readonly converter: StoreConverter<Season>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new SeasonConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Season>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocuments<Season>(COLLECTION, matchId, this.converter);
  }

  create(match: Season) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Season) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
