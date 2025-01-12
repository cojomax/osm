import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { Fixture } from '../api/models/fixture.model';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { FixtureConverter } from '../api/firebase/converters/fixture.converter';

const COLLECTION = FireStoreCollection.Fixtures;

@Injectable({
  providedIn: 'root',
})
export class FixtureService implements Repository<Fixture> {
  private readonly converter: StoreConverter<Fixture>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new FixtureConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Fixture>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Fixture>(COLLECTION, matchId, this.converter);
  }

  create(match: Fixture) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Fixture) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
