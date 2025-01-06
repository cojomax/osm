import { Observable } from 'rxjs';

export interface Repository<T = any> {
  fetch(): Observable<T[]>;

  find(id: string): Observable<T>;

  create(payload: T): Observable<void>;

  update(payload: T): Observable<void>;

  delete(id: string): Observable<void>;
}
