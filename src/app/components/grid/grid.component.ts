import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, SizeColumnsToFitGridStrategy } from 'ag-grid-community';

@Component({
  selector: 'osm-grid',
  imports: [AgGridAngular],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent<T> {
  @Input() colDefs: ColDef<T>[] = [];
  @Input() data: T[] = [];

  protected autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: 'fitGridWidth',
  };
}
