import { getIsoDate, getIsoTime } from '../../../shared/utility/date.util';
import { Fixture } from '../../models/fixture.model';
import { Goal } from '../../models/goal.model';
import { StoreConverter } from '../converter.interface';

export class FixtureConverter implements StoreConverter<Fixture> {
  toFirestore(fixture: Fixture) {
    return {
      season: this.toPojo(fixture.season),
      date: getIsoDate(fixture.date),
      time: getIsoTime(fixture.time),
      venue: this.toPojo(fixture.venue),
      competition: this.toPojo(fixture.competition),
      opponent: this.toPojo(fixture.opponent),
      homeGoals: fixture.homeGoals,
      opponentGoals: fixture.opponentGoals,
      goals: this.mapToGoals(fixture.goals),
      forfeit: fixture.forfeit,
      penalties: fixture.penalties,
      penaltiesHome: fixture.penaltiesHome,
      penaltiesOpponent: fixture.penaltiesOpponent,
    };
  }

  fromFirestore(snapshot: any): Fixture {
    const fixture = snapshot.data();
    return new Fixture({
      id: snapshot.id,
      season: fixture.season,
      date: new Date(fixture['date']),
      time: this.parseTime(fixture['date'], fixture['time']),
      venue: fixture['venue'],
      competition: fixture['competition'],
      opponent: fixture['opponent'],
      homeGoals: fixture['homeGoals'],
      opponentGoals: fixture['opponentGoals'],
      goals: fixture['goals'],
      forfeit: fixture['forfeit'],
      penalties: fixture['penalties'],
      penaltiesHome: fixture['penaltiesHome'],
      penaltiesOpponent: fixture['penaltiesOpponent'],
    });
  }

  private toPojo<T = object>(obj: T | null) {
    if (!obj) {
      return null;
    }

    const pojo = Object.create(null);

    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        pojo[key] = obj[key as keyof T] ?? null;
      }
    });

    return pojo as T;
  }

  // TODO Add repository layer and/or goal model for this
  private mapToGoals(goals: Goal[]) {
    return goals
      .filter((g) => !!g.scored)
      .map((goal) => ({
        scored: {
          id: goal.scored!.id,
          firstName: goal.scored!.firstName,
          lastName: goal.scored!.lastName,
        },
        assisted: !goal.assisted
          ? null
          : {
              id: goal.assisted.id,
              firstName: goal.assisted.firstName,
              lastName: goal.assisted.lastName,
            },
      }));
  }

  private parseTime(dateStr: string, timeStr: string | null): Date | null {
    if (!timeStr || !dateStr) {
      return null;
    }

    // Create a more reliable date string that works across all devices
    // Use ISO format which is more consistent across browsers and devices
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(dateStr);
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    return date;
  }
}
