import { computed, Injectable, signal } from '@angular/core';
import { Competition } from 'src/app/api/models/competition.model';
import { Season } from 'src/app/api/models/season.model';
import { SeasonStats } from 'src/app/models/season-stats.model';

export type Stat = { stat: string; value: string | number | undefined };

@Injectable({
  providedIn: 'root',
})
export class StatsPageState {
  mobileScrollPosition = signal<number>(0);

  selectedSeason = signal<Season | null>(null);
  selectedCompetition = signal<Competition | null>(null);
  seasonStats = signal<SeasonStats | null>(null);

  seasonPoints = computed(() => (this.seasonStats()?.gamesWon ?? 0) * 3 + (this.seasonStats()?.gamesDrawn ?? 0));
  isCupSeason = computed(() => this.selectedCompetition()?.format === 'Cup');
  isLeagueSeason = computed(() => this.selectedCompetition()?.format === 'League');

  playerData = signal<any>([]);

  /** Top 3 scorers */
  topScorers = computed(() => {
    const topGoals = [...new Set(this.scorers().map((s: any) => s.goals))].filter((_, i) => i <= 2);
    return this.scorers().filter((s: any) => topGoals.includes(s.goals));
  });

  topScorersStats = computed(() =>
    this.topScorers().map((t: any) => ({
      stat: `${t.firstName} ${t.lastName}`,
      value: t.goals,
    })),
  );

  /** Top 3 assistants */
  topAssistants = computed(() => {
    const topAssistants = [...new Set(this.assistants().map((s: any) => s.assists))].filter((_, i) => i <= 2);
    return this.assistants().filter((s: any) => topAssistants.includes(s.assists));
  });

  topAssistantsStats = computed(() =>
    this.topAssistants().map((t: any) => ({
      stat: `${t.firstName} ${t.lastName}`,
      value: t.assists,
    })),
  );

  /** Top 3 contributors */
  topContributions = computed(() => {
    const topContributions = [...new Set(this.contributors().map((s: any) => s.contributions))].filter(
      (_, i) => i <= 2,
    );
    return this.contributors().filter((s: any) => topContributions.includes(s.contributions));
  });

  topContributionsStats = computed(() =>
    this.topContributions().map((t: any) => ({
      stat: `${t.firstName} ${t.lastName}`,
      value: t.contributions,
    })),
  );

  scorers = computed(() =>
    this.playerData()
      .sort((a: any, b: any) => (a.goals < b.goals ? 1 : -1))
      .filter((p: any) => !!p.goals),
  );

  scorerStats = computed<Stat[]>(() =>
    this.scorers().map((s: any) => ({
      stat: `${s.firstName} ${s.lastName}`,
      value: s.goals,
    })),
  );

  assistants = computed(() =>
    this.playerData()
      .sort((a: any, b: any) => (a.assists < b.assists ? 1 : -1))
      .filter((p: any) => !!p.assists),
  );

  assistantStats = computed<Stat[]>(() =>
    this.assistants().map((s: any) => ({
      stat: `${s.firstName} ${s.lastName}`,
      value: s.assists,
    })),
  );

  contributors = computed(() =>
    this.playerData()
      .sort((a: any, b: any) => (a.contributions < b.contributions ? 1 : -1))
      .filter((p: any) => !!p.contributions),
  );

  contributorStats = computed<Stat[]>(() =>
    this.contributors().map((s: any) => ({
      stat: `${s.firstName} ${s.lastName}`,
      value: s.contributions,
    })),
  );
}
