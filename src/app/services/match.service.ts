import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { Match } from '../api/models/match.model';
import { StoreConverter } from '../api/firebase/converter.interface';

const COLLECTION = FireStoreCollection.Matches;

const matchConverter = {} as StoreConverter<Match>;

@Injectable({ providedIn: 'root' })
export class MatchService {
  constructor(private _dbSvc: FirebaseDbService) {}

  getAllMatches() {
    return this._dbSvc.getCollection<Match>(COLLECTION, matchConverter);
  }

  getMatch(matchId: string) {
    return this._dbSvc.getDocument<Match>(COLLECTION, matchId, matchConverter);
  }

  addMatch(match: Match) {
    return this._dbSvc.createDocument(COLLECTION, match, matchConverter);
  }

  updateMatch(match: Match) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, matchConverter);
  }

  deleteMatch(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
