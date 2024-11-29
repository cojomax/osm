import { Inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore/lite';
import { from, map } from 'rxjs';
import {
  FIREBASE,
  Firebase,
} from '../../../services/tokens/firebase-config.token';
import { StoreConverter } from '../converter.interface';
import { FireStoreCollection } from '../db-collection.enum';

@Injectable({ providedIn: 'root' })
export class FirebaseDbService {
  constructor(@Inject(FIREBASE) private _firebase: Firebase) {}

  getCollection<T>(name: string, converter: any) {
    return from(
      getDocs(collection(this._firebase.db, name).withConverter(converter)),
    ).pipe(
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)),
    );
  }

  getDocument<T>(collectionName: string, id: string, converter: any) {
    const docRef = doc(this._firebase.db, collectionName, id);
    return from(getDoc(docRef.withConverter(converter))).pipe(
      map((d: DocumentSnapshot) => d.data() as T),
    );
  }

  createDocument<T>(
    collectionName: FireStoreCollection,
    item: T,
    converter: StoreConverter<T>,
  ) {
    const ref = doc(
      collection(this._firebase.db, collectionName),
    ).withConverter(converter);
    return from(setDoc(ref, item));
  }

  private sanitizeItem<T>(item: T) {
    if (item && typeof item !== 'object') {
      return item;
    }

    for (const key in item) {
      if (typeof item[key] === 'string') {
        (item[key] as string) = item[key].trim();
      }
    }
    return item;
  }

  updateDocument<T>(
    collectionName: FireStoreCollection,
    id: string,
    item: T,
    converter: StoreConverter<T>,
  ) {
    if (!id) {
      throw new Error('No value for parameter: id');
    }

    this.sanitizeItem(item);

    const ref = doc(
      collection(this._firebase.db, collectionName),
      id,
    ).withConverter(converter);

    return from(setDoc(ref, item));
  }

  deleteDocument(collectionName: FireStoreCollection, id: string) {
    return from(deleteDoc(doc(this._firebase.db, collectionName, id)));
  }
}
