export class CompetitionAggregate {
  constructor(init: CompetitionAggregate) {
    Object.assign(this, init);
  }

  competitionId = '';
  format: 'League' | 'Cup' | '' = '';
  tier: 'Division 1' | 'Division 2' | 'Plate' | 'Cup' | '' = '';
  name = '';
  drawn: number | undefined;
  goalsAgainst = 0;
  goalsFor = 0;
  lost = 0;
  played = 0;
  points: number | undefined;
  position: number | string | undefined;
  won = 0;

  get isLeague() {
    return this.format === 'League';
  }

  get isCup() {
    return this.format === 'Cup';
  }
}
