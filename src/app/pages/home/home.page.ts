import { Component, OnInit, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'home.page.html',
  styleUrl: './home.page.css',
  imports: [DatePipe],
})
export class HomePageComponent implements OnInit {
  protected nextFixture = signal<Fixture | null>(null);

  constructor(private fixtureSvc: FixtureService) {}

  ngOnInit() {
    this.fixtureSvc.fetch().subscribe((data) => {
      // Find the fixture with the date in the future that's closes to today's date.
      const nextFixture = data
        .filter((fixture) => (fixture.date ?? -1) > new Date())
        .reduce((closest, current) => ((current?.date ?? -1) < (closest?.date ?? -1) ? current : closest));

      this.nextFixture.set(nextFixture);
      console.log(data);
    });
  }
}
