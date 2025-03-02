import { StoreConverter } from '../converter.interface';
import { Fixture } from '../../models/fixture.model';
import { getIsoDate, getIsoTime } from '../../../shared/utility/date.utility';
import { Goal } from '../../models/goal.model';

export class FixtureConverter implements StoreConverter<Fixture> {
  toFirestore(fixture: Fixture) {
    return {
      date: getIsoDate(fixture.date),
      time: getIsoTime(fixture.time),
      venue: this.toPojo(fixture.venue),
      competition: this.toPojo(fixture.competition),
      opponent: this.toPojo(fixture.opponent),
      goals: this.mapToGoals(fixture.goals),
    };
  }

  fromFirestore(snapshot: any): Fixture {
    const match = snapshot.data();
    return new Fixture({
      id: snapshot.id,
      date: new Date(match['date']),
      time: new Date(`${match['date']},${match['time']}`),
      venue: match['venue'],
      competition: match['competition'],
      opponent: match['opponent'],
      goals: match['goals'],
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
        assisted: {
          id: goal.assisted?.id,
          firstName: goal.assisted?.firstName,
          lastName: goal.assisted?.lastName,
        },
      }));
  }
}
