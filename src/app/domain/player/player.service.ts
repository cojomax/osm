import { Injectable } from '@angular/core';
import {
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore/lite';
import { FirebaseDbService } from '../../services/firebase/firebase.db.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { FireStoreCollections } from '../../shared/db-collection.enum';
import { Player } from './player.model';

const COLLECTION = FireStoreCollections.players;

const playerConverter = {
  toFirestore: (player: Player) => {
    const req = {
      firstName: player.firstName,
      lastName: player.lastName,
      squadNumber: player.squadNumber,
      position: player.position,
    };
    return req;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => {
    const player = snapshot.data();
    return new Player({
      playerId: snapshot.id,
      firstName: player['firstName'],
      lastName: player['lastName'],
      position: player['position'],
      squadNumber: player['squadNumber'],
    });
  },
};

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private _svc: FirebaseService,
    private _dbSvc: FirebaseDbService,
  ) {}

  getAllPlayers() {
    return this._dbSvc.getCollection<Player>(COLLECTION, playerConverter);
  }

  getPlayer(playerId: string) {
    return this._dbSvc.getDocument<Player>(COLLECTION, playerId, playerConverter);
  }

  addPlayer(player: Player) {
    return this._dbSvc.createDocument(COLLECTION, player, playerConverter);
  }

  updatePlayer(player: Player) {
    return this._dbSvc.updateDocument(
      COLLECTION,
      player.playerId,
      player,
      playerConverter,
    );
  }

  deletePlayer(playerId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, playerId);
  }
}
