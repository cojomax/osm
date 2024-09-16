import { Injectable } from '@angular/core';
import { MatchReport } from '../../models/match-report.model';
import { FirebaseDbService } from '../../services/firebase/firebase.db.service';

const COLLECTION_NAME = 'matches';

@Injectable({ providedIn: 'root' })
export class MatchService {
  constructor(private _fb: FirebaseDbService) {}

  async saveMatchReport(match: MatchReport) {
    // return await this._fb.createDocument(COLLECTION_NAME, match, {});
  }
}
