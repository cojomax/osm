import { Injectable } from '@angular/core';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { Player } from '../api/models/player.model';
import { Repository } from './repository.interface';
import { StoreConverter } from '../api/firebase/converter.interface';
import { PlayerConverter } from '../api/firebase/converters/player.converter';

const COLLECTION = FireStoreCollection.Players;

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements Repository<Player> {
  private readonly converter: StoreConverter<Player>;

  constructor(private _dbSvc: FirebaseDbService) {
    this.converter = new PlayerConverter();
  }

  fetch() {
    return this._dbSvc.getCollection<Player>(COLLECTION, this.converter);
  }

  find(playerIds: string) {
    return this._dbSvc.getDocuments<Player>(COLLECTION, playerIds, this.converter);
  }

  findMany(playerIds: string[]) {
    return this._dbSvc.getDocuments<Player>(COLLECTION, playerIds, this.converter);
  }

  create(player: Player) {
    return this._dbSvc.createDocument(COLLECTION, player, this.converter);
  }

  update(player: Player) {
    return this._dbSvc.updateDocument(COLLECTION, player.id, player, this.converter);
  }

  delete(playerId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, playerId);
  }
}
