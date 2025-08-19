import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { EMPTY, mergeMap, tap } from 'rxjs';
import { SeasonService } from 'src/app/services/season.service';
import { Fixture } from '../../api/models/fixture.model';
import { FixtureService } from '../../services/fixture.service';

@Component({
  templateUrl: 'home.page.html',
  styleUrl: './home.page.css',
  imports: [DatePipe],
})
export class HomePageComponent implements OnInit {
  protected nextFixture = signal<Fixture | null>(null);

  private readonly fixtureSvc = inject(FixtureService);
  private readonly seasonSvc = inject(SeasonService);

  ngOnInit() {
    this.seasonSvc
      .query([{ field: 'active', operator: '==', value: true }])
      .pipe(
        mergeMap((seasons) =>
          !seasons.length
            ? EMPTY
            : this.fixtureSvc.query([{ field: 'season.id', operator: '==', value: seasons[0].id }]),
        ),
        tap((data) => {
          const nextFixture = data.reduce((closest: Fixture | null, current: Fixture | null) => {
            if (!closest?.date && current?.date) {
              return current;
            }
            if (current?.date && current.date > new Date() && current.date < (closest?.date ?? -1)) {
              return current;
            }
            return closest;
          }, null);
          this.nextFixture.set(nextFixture);
        }),
      )
      .subscribe();
  }
}
