import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid',
  imports: [AgGridAngular, NzButtonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent<T> {
  @Input() colDefs: ColDef<T>[] = [];
  @Input() data: T[] = [];

  protected selectedItem: T | null = null;

  private subs = new Subscription();

  protected onAddClick() {
    //   this.openModal();
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
