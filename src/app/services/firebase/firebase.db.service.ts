import { Injectable } from '@angular/core';
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
import { StoreConverter } from 'src/app/shared/converter.interface';
import { FireStoreCollections } from 'src/app/shared/db-collection.enum';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseDbService {
  constructor(private _svc: FirebaseService) {}

  getCollection<T>(name: string, converter: any) {
    return from(
      getDocs(collection(this._svc.db, name).withConverter(converter)),
    ).pipe(
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)),
    );
  }

  getDocument<T>(collectionName: string, id: string, converter: any) {
    const docRef = doc(this._svc.db, collectionName, id);
    return from(getDoc(docRef.withConverter(converter))).pipe(
      map((d: DocumentSnapshot) => d.data() as T),
    );
  }

  createDocument<T>(
    collectionName: FireStoreCollections,
    item: T,
    converter: StoreConverter<T>,
  ) {
    const ref = doc(collection(this._svc.db, collectionName)).withConverter(
      converter,
    );
    return from(setDoc(ref, item));
  }

  updateDocument<T>(
    collectionName: FireStoreCollections,
    id: string,
    item: T,
    converter: StoreConverter<T>,
  ) {
    if (!id) {
      throw new Error('No value for parameter: id');
    }

    const ref = doc(
      collection(this._svc.db, collectionName),
      id,
    ).withConverter(converter);

    return from(setDoc(ref, item));
  }

  deleteDocument(collectionName: FireStoreCollections, id: string) {
    return from(deleteDoc(doc(this._svc.db, collectionName, id)));
  }
}
