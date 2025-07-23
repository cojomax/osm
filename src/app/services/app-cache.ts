import { computed, Injectable, signal } from '@angular/core';
import { Competition } from '../api/models/competition.model';
import { Player } from '../api/models/player.model';
import { Season } from '../api/models/season.model';

@Injectable({
  providedIn: 'root',
})
export class AppCache {
  // TODO Create CacheInterceptor to cache the data and think about using local storage
  // Talk to Perplexity

  seasons = signal<Season[]>([]);
  leagues = computed(() => this.seasons().map((s) => s.league));
  players = signal<Player[]>([]);
  competitions = signal<Competition[]>([]);
}
