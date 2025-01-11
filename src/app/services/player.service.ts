import { Injectable } from '@angular/core';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore/lite';
import { FireStoreCollection } from '../api/firebase/db-collection.enum';
import { FirebaseDbService } from '../api/firebase/services/firebase.db.service';
import { Player } from '../api/models/player.model';
import { Repository } from './repository.interface';

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
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    const player = snapshot.data();
    return new Player({
      id: snapshot.id,
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
export class PlayerService implements Repository<Player> {
  constructor(private _dbSvc: FirebaseDbService) {}

  fetch() {
    return this._dbSvc.getCollection<Player>(COLLECTION, playerConverter);
  }

  find(playerId: string) {
    return this._dbSvc.getDocument<Player>(COLLECTION, playerId, playerConverter);
  }

  create(player: Player) {
    return this._dbSvc.createDocument(COLLECTION, player, playerConverter);
  }

  update(player: Player) {
    return this._dbSvc.updateDocument(COLLECTION, player.id, player, playerConverter);
  }

  delete(playerId: string) {
    return this._dbSvc.deleteDocument(COLLECTION, playerId);
  }
}
