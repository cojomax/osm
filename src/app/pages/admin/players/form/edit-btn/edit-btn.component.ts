import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './edit-btn.component.html',
})
export class EditButtonComponent implements ICellRendererAngularComp {
  @Output() clicked = new EventEmitter<void>();

  private params: any;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  buttonClicked() {
    this.params.onEdit(this.params.data.playerId);
  }
}
