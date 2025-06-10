import { computed, Injectable, signal } from '@angular/core';

export type Stat = { stat: string; value: string | number | undefined };

@Injectable()
export class StatsPageState {
  playerData = signal<any>([]);

  /** Top 3 scorers */
  topScorers = computed(() => this.scorers().filter((_: any, i: number) => i <= 2));
  topScorersStats = computed(() =>
    this.topScorers().map((t: any) => ({
      stat: t.name,
      value: t.goals,
    })),
  );

  /** Top 3 assistants */
  topAssistants = computed(() => this.assistants().filter((_: any, i: number) => i <= 2));
  topAssistantsStats = computed(() =>
    this.topAssistants().map((t: any) => ({
      stat: t.name,
      value: t.goals,
    })),
  );

  /** Top 3 contributors */
  topContributions = computed(() => this.contributors().filter((_: any, i: number) => i <= 2));
  topContributionsStats = computed(() =>
    this.topContributions().map((t: any) => ({
      stat: t.name,
      value: t.goals,
    })),
  );

  scorers = computed(() =>
    this.playerData()
      .sort((a: any, b: any) => (a.goals < b.goals ? 1 : -1))
      .filter((p: any) => !!p.goals),
  );

  scorerStats = computed<Stat[]>(() =>
    this.scorers().map((s: any) => ({
      stat: s.name,
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
      stat: s.name,
      value: s.goals,
    })),
  );

  contributors = computed(() =>
    this.playerData()
      .sort((a: any, b: any) => (a.contributions < b.contributions ? 1 : -1))
      .filter((p: any) => !!p.contributions),
  );

  contributorStats = computed<Stat[]>(() =>
    this.contributors().map((s: any) => ({
      stat: s.name,
      value: s.goals,
    })),
  );
}
