import { Component, OnInit, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { Subscription, tap } from 'rxjs';
import { NzCardModule } from '@nz/card';
import { DatePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrl: './fixtures.page.css',
  imports: [DatePipe, NzCardModule, NzTagModule],
})
export class FixturesPageComponent implements OnInit {
  protected fixtures = signal<Fixture[]>([]);

  protected showFixtures = signal(false);

  private showResults = signal(false);
  private subs = new Subscription();

  constructor(
    private fixtureSvc: FixtureService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.showFixtures.set(this.route.snapshot.routeConfig?.path === 'fixtures');
    this.showResults.set(this.route.snapshot.routeConfig?.path === 'results');

    this.subs.add(
      this.fixtureSvc
        .fetch()
        .pipe(
          tap((data) => {
            // TODO Filter by season first.
            // TODO Make into FireStore query.

            const list = data
              .filter((f) => f.date)
              .filter((f) => (this.showFixtures() ? f.date!.getTime() >= Date.now() : f.date!.getTime() <= Date.now()))
              .sort((a, b) =>
                this.showFixtures()
                  ? (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
                  : (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
              );

            this.fixtures.set(list);
          }),
        )
        .subscribe(),
    );
  }

  protected getScoreColor(home: number, opponent: number) {
    return home === opponent ? '' : home > opponent ? 'green' : 'red';
  }
}
