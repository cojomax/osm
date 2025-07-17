import { Injectable, signal } from '@angular/core';
import { Season } from '../api/models/season.model';

@Injectable({
  providedIn: 'root',
})
export class State {
  seasons = signal<Season[]>([]);
}
