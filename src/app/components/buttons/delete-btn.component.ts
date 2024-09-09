import { Component, EventEmitter, Output } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  template: `<button (click)="buttonClicked()">Delete</button>`,
})
export class DeleteButtonComponent implements ICellRendererAngularComp {
  @Output() clicked = new EventEmitter<void>();

  private params: any;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  buttonClicked() {
    this.params.onDelete(this.params.data.playerId);
  }
}
