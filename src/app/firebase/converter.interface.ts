import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore/lite';

export interface StoreConverter<T> {
  toFirestore: (item: T) => object;
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => T;
}
