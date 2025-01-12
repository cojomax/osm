import { StoreConverter } from '../converter.interface';
import { Player } from '../../models/player.model';
import { QueryDocumentSnapshot } from 'firebase/firestore/lite';

export class PlayerConverter implements StoreConverter<Player> {
  toFirestore(player: Player) {
    return {
      firstName: player.firstName,
      lastName: player.lastName,
      squadNumber: player.squadNumber,
      position: player.position,
      country: player.country,
      dob: player.dob,
      height: player.height,
    };
  }

  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const player = snapshot.data();
    return new Player({
      id: snapshot.id,
      firstName: player['firstName'],
      lastName: player['lastName'],
      position: player['position'],
      squadNumber: player['squadNumber'],
      country: player['country'],
      // dob: extractDate(player['dob']),
      dob: player['dob']?.toDate(),
      height: player['height'],
    });
  }
}

// TODO Figure out what's going on here and try remove this function.
// const extractDate = (date: Timestamp | string) =>
//   typeof date === 'string' ? new Date(date) : (date?.toDate() ?? null);
