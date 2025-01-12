import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DomainItem } from '../../../../api/models/domain-item.interface';

@Component({
  imports: [NzButtonModule],
  template: '<button nz-button nzType="link" (click)="buttonClicked()">Edit</button>',
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
    this.params.onEdit((this.params.data as DomainItem).id);
  }
}
