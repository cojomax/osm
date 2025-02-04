import { Component, OnInit, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-fixtures',
  imports: [],
  templateUrl: './fixtures.page.html',
  styleUrl: './fixtures.page.css',
})
export class FixturesPageComponent implements OnInit {
  protected fixtures = signal<Fixture[]>([]);

  private subs = new Subscription();

  constructor(private fixtureSvc: FixtureService) {}

  ngOnInit() {
    this.subs.add(
      this.fixtureSvc
        .fetch()
        .pipe(
          tap((data) => {
            this.fixtures.set(data);
          }),
        )
        .subscribe(),
    );
  }
}
