import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { first, mergeMap, tap } from 'rxjs';
import { AppCache } from 'src/app/services/app-cache';
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
  private readonly state = inject(AppCache);

  ngOnInit() {
    this.seasonSvc
      .fetch()
      .pipe(
        first(),
        mergeMap(() => this.fixtureSvc.query([{ field: 'season.id', query: this.state.seasons()[0].id }])),
        tap((data) => {
          // Find the fixture with the date in the future that's closes to today's date.

          // FIXME Make this smarter!!!
          const nextFixture = data.filter((fixture) => (fixture.date ?? -1) > new Date())[0];

          // .reduce(
          //   (closest: Fixture | null, current: Fixture | null) =>
          //     !current?.date ? closest : current.date < (closest?.date ?? -1) ? current : closest,
          //   null,
          // );

          this.nextFixture.set(nextFixture);
        }),
      )
      .subscribe();
  }
}
