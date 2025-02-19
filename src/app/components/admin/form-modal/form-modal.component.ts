import {
  Component,
  computed,
  ContentChild,
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
import { Entity } from '../../../api/models/entity.interface';
import { FormModalService } from './form-modal.service';
import { FormComponent } from '../../form/form.component';

@Component({
  selector: 'app-form-modal',
  imports: [NzModalModule, NzButtonComponent, CommonModule, NzModalFooterDirective],
  templateUrl: './form-modal.component.html',
})
export class FormModalComponent<T> implements OnInit, OnDestroy {
  modalTitle = input('');

  @ContentChild(FormComponent, { static: true }) formComponent!: FormComponent;

  /** Control the visibility of the form. Needs to be a plain property for two-way data binding. */
  protected isVisible = false;

  protected item = signal<Entity | undefined>(void 0);

  protected isSubmitting = computed(() => this.formState() === 'submit');
  protected isDeleting = computed(() => this.formState() === 'delete');
  protected isFormProcessing = computed(() => this.isSubmitting() || this.isDeleting());
  protected isEditForm = computed(() => !!this.formSvc.formData());
  protected modalTitleTxt = computed(() => `${this.isEditForm() ? 'Edit' : 'Add'} ${this.modalTitle()}`);
  protected isValid = computed(() => this.formSvc.formIsValid());

  private formState = computed(() => this.formSvc.formState());

  private subs = new Subscription();

  @Output() modified = new EventEmitter<unknown>();

  constructor(protected formSvc: FormModalService<Entity>) {}

  ngOnInit() {
    this.subs.add(
      this.formSvc.isVisible$.subscribe((payload) => {
        const { visible, data } = payload;
        // Initialize the form state and optionally fill with data.
        this.formComponent?.reset(data);
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
        .submitForm(this.formComponent.form.value, this.isEditForm())
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
