import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Entity } from '../../../../api/models/entity.interface';

@Component({
  imports: [NzButtonModule],
  template: '<button nz-button nzType="dashed" (click)="buttonClicked()">Edit</button>',
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
    this.params.onEdit((this.params.data as Entity).id);
  }
}
