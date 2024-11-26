import { Injectable } from '@angular/core';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore/lite';
import { FireStoreCollection } from '../firebase/db-collection.enum';
import { FirebaseDbService } from '../firebase/services/firebase.db.service';
import { Player } from '../models/player.model';

const COLLECTION = FireStoreCollection.Players;

const playerConverter = {
  toFirestore: (player: Player) => {
    const req = {
      firstName: player.firstName,
      lastName: player.lastName,
      squadNumber: player.squadNumber,
      position: player.position,
      country: player.country,
      dob: player.dob,
      height: player.height,
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
      country: player['country'],
      dob: extractDate(player['dob']),
      height: player['height'],
    });
  },
};

// TODO Figure out what's going on here and try remove this function.
const extractDate = (date: Timestamp | string) =>
  typeof date === 'string' ? new Date(date) : (date?.toDate() ?? null);

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private _dbSvc: FirebaseDbService) {}

  getAllPlayers() {
    return this._dbSvc.getCollection<Player>(COLLECTION, playerConverter);
  }

  getPlayer(playerId: string) {
    return this._dbSvc.getDocument<Player>(
      COLLECTION,
      playerId,
      playerConverter,
    );
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
