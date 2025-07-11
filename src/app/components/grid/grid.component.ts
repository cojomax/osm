import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, SizeColumnsToFitGridStrategy } from 'ag-grid-community';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'osm-grid',
  imports: [AgGridAngular, NzButtonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent<T> {
  @Input() colDefs: ColDef<T>[] = [];
  @Input() data: T[] = [];

  @Output() add = new EventEmitter<void>();

  protected selectedItem: T | null = null;

  protected autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: 'fitGridWidth',
  };

  private subs = new Subscription();

  protected onAddClick() {
    this.add.emit();
  }

  // protected onEditClick(playerId: string) {
  //   this.isEditing = true;
  //   this.openModal(this.players.find((p) => p.playerId === playerId)!);
  // }

  // private refreshTable() {
  //   return this.playerSvc.getAllPlayers().pipe(
  //     tap((players) => {
  //       this.players = players;
  //     }),
  //   );
  // }

  // private openModal(player: Player | null = null) {
  //   this.selectedItem = player;
  // }
}
