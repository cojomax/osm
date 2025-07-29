import { Injectable } from '@angular/core';
import { Fixture } from '../api/models/fixture.model';
import { Goal } from '../api/models/goal.model';
import { Player } from '../api/models/player.model';
import { SeasonStats } from '../models/season-stats.model';
import { toFixed } from '../shared/utility/number.util';

export enum SeasonStat {
  GamesPlayed = 'Games Played',
  GamesWon = 'Games Won',
  GamesLost = 'Games Lost',
  GamesDrawn = 'Games Drawn',
  WinPercentage = 'Win Percentage',
  GoalsScored = 'Goals Scored',
  GoalsConceded = 'Goals Conceded',
}

export enum PlayerSeasonStat {
  MostGoals = 'Most Goals',
  MostAssists = 'Most Assists',
  MostContributions = 'Most Contributions',
}

export interface AggSeasonStats {
  team: SeasonStats;
  player: { stat: PlayerSeasonStat; value: number; player: Player }[];
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  generateSeasonStats(results: Fixture[]) {
    return this.calcSeasonStats(results);
  }

  generatePlayerStats(results: Fixture[]) {
    return this.calcPlayerStats(results);
  }

  /** Generate stats for a particular season. */
  private calcSeasonStats(fixtures: Fixture[]): SeasonStats {
    const gamesPlayed = fixtures.length;

    const gamesWon = fixtures.filter((f) => f.won).length;
    const gamesLost = fixtures.filter((f) => f.lost).length;
    const gamesDrawn = fixtures.filter((f) => f.drawn).length;
    const cleanSheets = fixtures.filter((f) => f.cleanSheet).length;
    const winPercentage = toFixed(gamesWon / gamesPlayed, 2);

    const goals = fixtures.flatMap((f) => f.goals);
    const goalsScored = goals.length;
    const goalsConceded = fixtures.reduce((acc, curr) => acc + curr.opponentGoals, 0);
    const goalDifference = goalsScored - goalsConceded;

    const topPlayers = this.calcPlayerSeasonStats(fixtures);
    const topScorer = {
      player: topPlayers.topScorer.maxScorer,
      value: topPlayers.topScorer.maxGoalCount,
    };
    const topAssistant = {
      player: topPlayers.topAssistant.maxAssistant,
      value: topPlayers.topAssistant.maxAssistCount,
    };
    const topContributor = {
      player: topPlayers.topContributor.maxContributor,
      value: topPlayers.topContributor.maxContributorCount,
    };

    return {
      gamesPlayed,
      gamesWon,
      gamesLost,
      gamesDrawn,
      goalsScored,
      goalsConceded,
      goalDifference,
      winPercentage,
      cleanSheets,
      topScorer,
      topAssistant,
      topContributor,
    };
  }

  private calcPlayerStats(results: Fixture[]) {
    const goals = results.flatMap((r) => r.goals);

    const goalsMap = new Map<string, number>();
    const assistsMap = new Map<string, number>();
    const contributionsMap = new Map<string, number>();

    goals.forEach((goal) => {
      const scorer = goal.scored!.id;
      goalsMap.set(scorer, (goalsMap.get(scorer) ?? 0) + 1);
      contributionsMap.set(scorer, (contributionsMap.get(scorer) ?? 0) + 1);

      if (goal.assisted) {
        const assisted = goal.assisted!.id;

        assistsMap.set(assisted, (assistsMap.get(assisted) ?? 0) + 1);
        contributionsMap.set(assisted, (contributionsMap.get(assisted) ?? 0) + 1);
      }
    });

    return {
      goals: goalsMap,
      assists: assistsMap,
      contributions: contributionsMap,
    };
  }

  private calcPlayerSeasonStats(fixtures: Fixture[]) {
    const goals = fixtures.flatMap((f) => f.goals);

    const contributions = this.calcTopContributors(goals);

    const topScorer = contributions.scorer;
    const topAssistant = contributions.assistant;
    const topContributor = contributions.contributor;

    return {
      topScorer: {
        maxScorer: topScorer.maxScorer!,
        maxGoalCount: topScorer.maxGoalCount,
      },
      topAssistant: {
        maxAssistant: topAssistant.maxAssistant!,
        maxAssistCount: topAssistant.maxAssistCount,
      },
      topContributor: {
        maxContributor: topContributor.maxContributor!,
        maxContributorCount: topContributor.maxContributorCount,
      },
    };
  }

  private calcTopContributors(goals: Goal[]) {
    const goalMap = new Map<string, number>();
    const assistMap = new Map<string, number>();
    const contributorMap = new Map<string, number>();

    let maxScorer = '';
    let maxGoalCount = 0;

    let maxAssistant = '';
    let maxAssistCount = 0;

    let maxContributor = '';
    let maxContributorCount = 0;

    goals.forEach((goal) => {
      const scorer = goal.scored!.id;
      goalMap.set(scorer, (goalMap.get(scorer) ?? 0) + 1);
      contributorMap.set(scorer, (contributorMap.get(scorer) ?? 0) + 1);

      if (goalMap.get(scorer)! > maxGoalCount) {
        maxGoalCount = goalMap.get(scorer)!;
        maxScorer = scorer;
      }

      if (contributorMap.get(scorer)! > maxContributorCount) {
        maxContributorCount = contributorMap.get(scorer)!;
        maxContributor = scorer;
      }

      if (goal.assisted) {
        const assisted = goal.assisted!.id;

        assistMap.set(assisted, (assistMap.get(assisted) ?? 0) + 1);
        contributorMap.set(assisted, (contributorMap.get(assisted) ?? 0) + 1);

        if (assistMap.get(assisted)! > maxAssistCount) {
          maxAssistCount = assistMap.get(assisted)!;
          maxAssistant = assisted;
        }

        if (contributorMap.get(assisted)! > maxContributorCount) {
          maxContributorCount = contributorMap.get(assisted)!;
          maxContributor = assisted;
        }
      }
    });

    return {
      scorer: {
        maxScorer: goals.find((g) => g.scored?.id === maxScorer)!.scored,
        maxGoalCount,
      },
      assistant: {
        maxAssistant: goals.find((g) => g.assisted?.id === maxAssistant)!.assisted,
        maxAssistCount,
      },
      contributor: {
        maxContributor:
          goals.find((g) => g.scored?.id === maxScorer)?.scored ??
          goals.find((g) => g.assisted?.id === maxContributor)!.assisted,
        maxContributorCount,
      },
    };
  }
}
