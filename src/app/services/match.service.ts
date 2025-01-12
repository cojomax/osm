import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { Match } from '../api/models/match.model';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { FixtureConverter } from '../api/firebase/converters/fixture.converter';

const COLLECTION = FireStoreCollection.Matches;

@Injectable({
  providedIn: 'root',
})
export class MatchService implements Repository<Match> {
  private readonly converter: StoreConverter<Match>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new FixtureConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Match>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Match>(COLLECTION, matchId, this.converter);
  }

  create(match: Match) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Match) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
