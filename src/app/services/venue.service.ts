import { Injectable } from '@angular/core';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { Venue } from '../api/models/venue.model';
import { StoreConverter } from '../api/firebase/converter.interface';
import { Repository } from './repository.interface';
import { SimpleConverter } from '../api/firebase/converters/simple.converter';

const COLLECTION = FireStoreCollection.Venues;

@Injectable({
  providedIn: 'root',
})
export class VenueService implements Repository<Venue> {
  private readonly converter: StoreConverter<Venue>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new SimpleConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Venue>(COLLECTION, this.converter);
  }

  find(matchId: string) {
    return this._dbSvc.getDocument<Venue>(COLLECTION, matchId, this.converter);
  }

  create(match: Venue) {
    return this._dbSvc.createDocument(COLLECTION, match, this.converter);
  }

  update(match: Venue) {
    return this._dbSvc.updateDocument(COLLECTION, match.id, match, this.converter);
  }

  delete(matchId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, matchId);
  }
}
