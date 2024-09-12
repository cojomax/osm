import { Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore/lite';
import { from } from 'rxjs';
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

  addPlayer(player: Player) {
    this._dbSvc.createDocument(player, playerConverter, COLLECTION);
  }

  updatePlayer(player: Player) {
    this._dbSvc.updateDocument(
      player.playerId,
      player,
      playerConverter,
      COLLECTION,
    );
  }

  deletePlayer(playerId: string) {
    return from(deleteDoc(doc(this._svc.db, COLLECTION, playerId)));
  }
}
