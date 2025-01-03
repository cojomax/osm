import { Component, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { NzModalComponent, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalModule } from '@nz/modal';

@Component({
  selector: 'app-edit-modal',
  imports: [NzModalComponent, NzModalModule, NzButtonComponent, CommonModule, NzModalFooterDirective],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent {
  isVisible: boolean = false;
  protected isSaving = signal(false);
  protected isDeleting = signal(false);
  protected isEditing = signal(false);
  protected isSubmitDisabled = signal(true);

  @Input() modalTitle = '';

  isModalVisible = input(false);

  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  constructor() {
    effect(() => {
      this.isVisible = this.isModalVisible();
    });
  }

  protected onModalOpen() {
    // this.isSubmitDisabled = this.form?.playerForm.invalid ?? true;
    //
    // this.subs.add(
    //   this.form!.playerForm.statusChanges.pipe(
    //     tap(() => {
    //       this.isSubmitDisabled = this.form!.playerForm.invalid;
    //     }),
    //   ).subscribe(),
    // );
  }

  protected onSubmit() {
    //   if (!this.form) {
    //     return;
    //   }
    //
    //   this.isSaving = true;
    //
    //   const write$ = this.form.playerForm.get('playerId')?.value
    //     ? this.playerSvc.updatePlayer(this.form.playerForm.value)
    //     : this.playerSvc.addPlayer(new Player(this.form.playerForm.value));
    //
    //   this.subs.add(
    //     write$
    //       .pipe(
    //         mergeMap(() => this.refreshTable()),
    //         finalize(() => {
    //           this.closeModal();
    //           this.isSaving = false;
    //         }),
    //       )
    //       .subscribe(),
    //   );
  }

  protected onDelete() {
    //   this.isDeleting = true;
    //   this.playerSvc
    //     .deletePlayer(this.selectedItem!.playerId)
    //     .pipe(
    //       mergeMap(() => this.refreshTable()),
    //       finalize(() => {
    //         this.closeModal();
    //         this.isDeleting = false;
    //       }),
    //     )
    //     .subscribe();
  }

  protected onCancel() {
    this.cancel.emit();
  }

  protected onModalClose() {
    // this.isEditing = false;
    // this.selectedItem = null;
  }
}
