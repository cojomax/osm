import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  WithFieldValue,
} from 'firebase/firestore/lite';
import { from, map } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseDbService {
  constructor(private _fbSvc: FirebaseService) {}

  async saveToCollection<T>(name: string, data: T) {
    const _data = data as WithFieldValue<DocumentData>;
    try {
      const newMatchRef = doc(collection(this._fbSvc.db, name)).withConverter;
      //   const docRef = await addDoc(collection(this._fbSvc.db, name), _data);
      //   console.log('Document written with ID: ', docRef.id);
      // await setDoc(newMatchRef, _data);

      console.log('Document written with ID: ', newMatchRef);
    } catch (err) {
      console.error('Error adding document: ', err);
      throw err;
    }
  }

  getCollection<T>(name: string, converter: any) {
    return from(
      getDocs(collection(this._fbSvc.db, name).withConverter(converter)),
    ).pipe(
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)),
    );
  }
}
