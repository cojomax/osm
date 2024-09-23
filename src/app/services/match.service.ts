import { Injectable } from '@angular/core';
import { MatchReport } from '../models/match-report.model';

const COLLECTION_NAME = 'matches';

@Injectable({ providedIn: 'root' })
export class MatchService {
  constructor() {}

  async saveMatchReport(match: MatchReport) {
    // return await this._fb.createDocument(COLLECTION_NAME, match, {});
  }
}
