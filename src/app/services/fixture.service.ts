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

  find(fixtureId: string) {
    return this._dbSvc.getDocuments<Fixture>(COLLECTION, fixtureId, this.converter);
  }

  query(field: string, query: string) {
    return this._dbSvc.queryDocuments<Fixture>(COLLECTION, this.converter, { field, query });
  }

  create(fixture: Fixture) {
    return this._dbSvc.createDocument(COLLECTION, fixture, this.converter);
  }

  update(fixture: Fixture) {
    return this._dbSvc.updateDocument(COLLECTION, fixture.id, fixture, this.converter);
  }

  delete(fixtureId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, fixtureId);
  }
}
