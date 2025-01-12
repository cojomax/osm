import {
  Component,
  computed,
  contentChild,
  EventEmitter,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalModule } from '@nz/modal';
import { Subscription, tap } from 'rxjs';
import { DomainItem } from '../../../api/models/domain-item.interface';
import { FormModalService } from './form-modal.service';
import { FormComponent } from '../../form/form.component';
import { PlayerFormComponent } from '../../../pages/admin/players/form/player.form';

@Component({
  selector: 'app-form-modal',
  imports: [NzModalModule, NzButtonComponent, CommonModule, NzModalFooterDirective],
  templateUrl: './form-modal.component.html',
})
export class FormModalComponent<T> implements OnInit, OnDestroy {
  modalTitle = input('');

  formState = computed(() => this.formSvc.formState());
  isSubmitting = computed(() => this.formState() === 'submit');
  isDeleting = computed(() => this.formState() === 'delete');
  isFormProcessing = computed(() => this.isSubmitting() || this.isDeleting());

  formComponent = contentChild.required<FormComponent>(PlayerFormComponent);
  protected isVisible = false;
  protected item = signal<DomainItem | undefined>(void 0);

  protected isEditForm = computed(() => !!this.formSvc.formData());
  protected modalTitleTxt = computed(() => `${this.isEditForm() ? 'Edit' : 'Add'} ${this.modalTitle()}`);
  protected isValid = computed(() => this.formSvc.formIsValid());

  private subs = new Subscription();

  @Output() modified = new EventEmitter<unknown>();

  constructor(protected formSvc: FormModalService<DomainItem>) {}

  ngOnInit() {
    this.subs.add(
      this.formSvc.isVisible$.subscribe((payload) => {
        const { visible, data } = payload;
        this.formComponent().reset(data);
        this.isVisible = visible;
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected onSubmit() {
    this.subs.add(
      this.formSvc
        .submitForm(this.formComponent().form.value, this.isEditForm())
        .pipe(
          tap(() => {
            this.modified.emit();
          }),
        )
        .subscribe(),
    );
  }

  protected onDelete() {
    this.subs.add(
      this.formSvc
        .deleteItem()
        .pipe(
          tap(() => {
            this.modified.emit();
          }),
        )
        .subscribe(),
    );
  }

  protected onCancel() {
    this.formSvc.closeModal();
  }

  protected onAfterClose() {
    this.formSvc.destroy();
  }
}
