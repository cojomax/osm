import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { NameConverter } from '../api/firebase/converters/name.converter';
import { Name } from '../api/models/name.model';

const COLLECTION = FireStoreCollection.Teams;

@Injectable({
  providedIn: 'root',
})
export class TeamService implements Repository<Name> {
  private readonly converter: StoreConverter<Name>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new NameConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Name>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Name>(COLLECTION, matchId, this.converter);
  }

  create(match: Name) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Name) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
