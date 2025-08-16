import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { StoreConverter } from '../api/firebase/converter.interface';
import { FixtureConverter } from '../api/firebase/converters/fixture.converter';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { Query } from '../api/firebase/types/query.interface';
import { Fixture } from '../api/models/fixture.model';
import { Repository } from './repository.interface';

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

  query(queries: Query[]) {
    return this._dbSvc.queryDocumentsByFields<Fixture>(COLLECTION, this.converter, queries);
  }

  create(fixture: Fixture) {
    if (!fixture.season) {
      return throwError(() => 'No season for fixture operation');
    }

    return this._dbSvc.createDocument(COLLECTION, fixture, this.converter);
  }

  update(fixture: Fixture) {
    return this._dbSvc.updateDocument(COLLECTION, fixture.id, fixture, this.converter);
  }

  delete(fixtureId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, fixtureId);
  }

  fetchBySeason(seasonId?: string, competitionId?: string) {
    const queries: Query[] = [];
    if (seasonId && seasonId !== 'all') {
      queries.push({ field: 'season.id', query: seasonId });
    }

    if (competitionId && competitionId !== 'all') {
      queries.push({ field: 'competition.id', query: competitionId });
    }

    return this.query(queries);
  }
}
