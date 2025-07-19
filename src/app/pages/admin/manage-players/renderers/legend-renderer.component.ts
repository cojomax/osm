import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { NzIconModule } from '@nz/icon';

@Component({
  selector: 'app-legend-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nz-icon [nzType]="value()" nzTheme="outline" />`,
  imports: [NzIconModule],
})
export class LegendRenderer implements ICellRendererAngularComp {
  protected value = signal<string>('');

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.value.set(params.value ? 'check-circle' : '');
    return true;
  }
}
