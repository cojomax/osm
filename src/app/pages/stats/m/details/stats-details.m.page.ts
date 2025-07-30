import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { StatsTableComponent } from '../../../../components/stats-table/stats-table.component';
import { Stat, StatsPageState } from '../../stats-page.state';

type Category = 'performance' | 'goals' | 'assists' | 'contributions';

@Component({
  templateUrl: 'stats-details.m.page.html',
  styleUrls: ['../stats.m.page.css'],
  imports: [StatsTableComponent, NzButtonComponent, NzIconDirective, RouterLink, TitleCasePipe],
})
export class StatsMDetailsPageComponent<T> implements OnInit {
  protected page = inject(StatsPageState);
  protected data = signal<Stat[]>([]);
  protected pageTitle = computed(() => this.category());

  private category = signal<Category | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    if (!this.page.playerData().length) {
      // TODO Move to guard? Can this work if the service is not in root injector?
      this.router.navigateByUrl('/stats');
    }

    this.category.set((this.route.snapshot.paramMap.get('category') ?? null) as Category | null);
    this.setDetailsData();
  }

  private setDetailsData() {
    switch (this.category()) {
      // case 'performance':
      //   this.data.set([]);
      //   break;
      case 'goals':
        this.data.set(this.page.scorerStats());
        break;
      case 'assists':
        this.data.set(this.page.assistantStats());
        break;
      case 'contributions':
        this.data.set(this.page.contributorStats());
        break;
    }
  }
}
