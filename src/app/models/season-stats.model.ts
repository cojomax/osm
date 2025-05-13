import { Player } from '../api/models/player.model';

export interface SeasonStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  winPercentage: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  cleanSheets: number;
  yellowCards?: number;
  redCards?: number;
  topScorer: {
    player: Pick<Player, 'id' | 'firstName' | 'lastName'>;
    value: number;
  };
  topAssistant: {
    player: Pick<Player, 'id' | 'firstName' | 'lastName'>;
    value: number;
  };
  topContributor: {
    player: Pick<Player, 'id' | 'firstName' | 'lastName'>;
    value: number;
  };
}
