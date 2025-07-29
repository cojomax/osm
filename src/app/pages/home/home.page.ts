import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Fixture } from '../../api/models/fixture.model';
import { FixtureService } from '../../services/fixture.service';

@Component({
  templateUrl: 'home.page.html',
  styleUrl: './home.page.css',
  imports: [RouterLink],
})
export class HomePageComponent implements OnInit {
  protected nextFixture = signal<Fixture | null>(null);

  constructor(private fixtureSvc: FixtureService) {}

  ngOnInit() {
    this.fixtureSvc.fetch().subscribe((data) => {
      // Find the fixture with the date in the future that's closes to today's date.
      const nextFixture = data
        .filter((fixture) => (fixture.date ?? -1) > new Date())
        .reduce(
          (closest: Fixture | null, current: Fixture | null) =>
            (current?.date ?? -1) < (closest?.date ?? -1) ? current : closest,
          null,
        );

      this.nextFixture.set(nextFixture);
    });
  }
}
