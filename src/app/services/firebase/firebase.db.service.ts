import { Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    DocumentData,
    WithFieldValue,
} from 'firebase/firestore/lite';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseDbService {
  constructor(private _fbSvc: FirebaseService) {}

  async saveToCollection<T>(name: string, data: T) {
    const _data = data as WithFieldValue<DocumentData>;
    try {
      const docRef = await addDoc(collection(this._fbSvc.db, name), _data);
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
      throw err;
    }
  }
}
