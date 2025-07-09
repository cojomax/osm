import { inject, Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';
import { StoreConverter } from '../converter.interface';
import { FireStoreCollection } from '../db-collection.enum';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseDbService {
  private firestore = inject(Firestore);

  //#region Collections

  getCollection<T>(name: string, converter: any) {
    return from(getDocs(collection(this.firestore, name).withConverter(converter))).pipe(
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)),
    );
  }

  //#endregion Collections

  //#region Documents

  createDocument<T>(collectionName: FireStoreCollection, item: T, converter: StoreConverter<T>) {
    const ref = doc(collection(this.firestore, collectionName)).withConverter(converter);
    return from(setDoc(ref, item));
  }

  getDocuments<T>(collectionName: string, ids: string, converter: any): Observable<T>;
  getDocuments<T>(collectionName: string, ids: string[], converter: any): Observable<T[]>;
  getDocuments<T>(collectionName: string, ids: string | string[], converter: any): Observable<T | T[]> {
    if (!ids || !ids.length) {
      throw new Error('No value for parameter: id');
    }

    if (typeof ids === 'string') {
      const docRef = doc(this.firestore, collectionName, ids);
      return from(getDoc(docRef.withConverter(converter))).pipe(map((d) => d.data() as T));
    }

    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where('__name__', 'in', ids));
    return from(getDocs(q)).pipe(map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)));
  }

  queryDocuments<T>(collectionName: string, converter: any, search: { field: string; query: string }): Observable<T[]> {
    const q = query(
      collection(this.firestore, collectionName).withConverter(converter),
      where(search.field, '==', search.query),
    );

    return from(getDocs(q)).pipe(map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as T)));
  }

  updateDocument<T>(collectionName: FireStoreCollection, id: string, item: T, converter: StoreConverter<T>) {
    if (!id) {
      throw new Error('No value for parameter: id');
    }

    this.sanitizeItem(item);

    const ref = doc(collection(this.firestore, collectionName), id).withConverter(converter);

    return from(setDoc(ref, item));
  }

  deleteDocument(collectionName: FireStoreCollection, id: string) {
    return from(deleteDoc(doc(this.firestore, collectionName, id)));
  }

  //#endregion Documents

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

  //#region Queries

  /*
   * Operators
   * ---------
   * < less than
   * <= less than or equal to
   * == equal to
   * > greater than
   * >= greater than or equal to
   * != not equal to
   * array-contains
   * array-contains-any
   * in
   * not-in
   */

  findDocumentByField<T>(collectionName: string, field: string, value: any, converter: any) {
    throw new Error('Not implemented');
  }
  //#endregion Queries
}
