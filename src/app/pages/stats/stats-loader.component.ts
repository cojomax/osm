import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { StatsPageService } from './stats-page.service';

@Component({
  selector: 'osm-stats-loader',
  template: `<ng-container *ngComponentOutlet="component"></ng-container>`,
  imports: [NgComponentOutlet],
})
export class StatsLoaderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private statsPageSvc = inject(StatsPageService);

  protected component = this.statsPageSvc.initComponent(this.route.snapshot.data);

  ngOnInit() {
    this.statsPageSvc.initPage().subscribe();
  }
}
