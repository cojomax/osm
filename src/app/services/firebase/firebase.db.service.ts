import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  setDoc,
  WithFieldValue,
} from 'firebase/firestore/lite';
import { from, map } from 'rxjs';
import { StoreConverter } from 'src/app/shared/converter.interface';
import { FireStoreCollections } from 'src/app/shared/db-collection.enum';
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

  getDocument<T>(name: string, id: string, converter: any) {}

  createDocument<T>(
    item: T,
    converter: StoreConverter<T>,
    collectionName: FireStoreCollections,
  ) {
    const ref = doc(collection(this._fbSvc.db, collectionName)).withConverter(
      converter,
    );
    return from(setDoc(ref, item));
  }

  updateDocument<T>(
    id: string,
    item: T,
    converter: StoreConverter<T>,
    collectionName: FireStoreCollections,
  ) {
    if (!id) {
      throw new Error('No value for parameter: id');
    }

    const ref = doc(
      collection(this._fbSvc.db, collectionName),
      id,
    ).withConverter(converter);

    return from(setDoc(ref, item));
  }
}
