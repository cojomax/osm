import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { Competition } from '../api/models/competition.model';
import { CompetitionConverter } from '../api/firebase/converters/competition.converter';

const COLLECTION = FireStoreCollection.Competitions;

@Injectable({
  providedIn: 'root',
})
export class CompetitionService implements Repository<Competition> {
  private readonly converter: StoreConverter<Competition>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new CompetitionConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Competition>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Competition>(COLLECTION, matchId, this.converter);
  }

  create(match: Competition) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Competition) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
