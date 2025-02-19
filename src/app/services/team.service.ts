import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { SimpleConverter } from '../api/firebase/converters/simple.converter';
import { Team } from '../api/models/team.model';

const COLLECTION = FireStoreCollection.Teams;

@Injectable({
  providedIn: 'root',
})
export class TeamService implements Repository<Team> {
  private readonly converter: StoreConverter<Team>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new SimpleConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Team>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Team>(COLLECTION, matchId, this.converter);
  }

  create(match: Team) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Team) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
