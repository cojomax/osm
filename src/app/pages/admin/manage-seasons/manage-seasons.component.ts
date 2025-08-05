import { Component, inject, signal } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { ColDef } from 'ag-grid-community';
import { Season } from 'src/app/api/models/season.model';
import { FormModalComponent } from 'src/app/components/admin/form-modal/form-modal.component';
import { FormModalService } from 'src/app/components/admin/form-modal/form-modal.service';
import { REPOSITORY_SERVICE } from 'src/app/components/admin/form-modal/form-modal.token';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { SeasonService } from 'src/app/services/season.service';

@Component({
  selector: 'osm-manage-seasons',
  imports: [GridComponent, FormModalComponent, NzButtonModule, NzIconModule],
  templateUrl: './manage-seasons.component.html',
  styleUrl: './manage-seasons.component.css',
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: SeasonService }],
})
export class ManageSeasonsComponent {
  protected seasons = signal<Season[]>([]);

  protected colDefs: ColDef<Season>[] = [{ field: 'name' }, { field: 'startDate' }, { field: 'endDate' }];

  private seasonSvc = inject(SeasonService);

  ngOnInit() {
    // TODO Force API call?
    this.seasonSvc.fetch().subscribe((seasons) => {
      this.seasons.set(seasons);
    });
  }

  protected onAdd() {
    console.log('add');
  }

  protected onModified() {
    console.log('modified');
  }
}
