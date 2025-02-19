import { Inject, Injectable, signal } from '@angular/core';
import { REPOSITORY_SERVICE } from './form-modal.token';
import { Repository } from '../../../services/repository.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Entity } from '../../../api/models/entity.interface';

interface ModalState<T> {
  visible: boolean;
  data: T | null;
}

@Injectable()
export class FormModalService<T extends Entity> {
  isVisible$: Observable<ModalState<T>>;

  private isVisibleSbj = new BehaviorSubject<ModalState<T>>({ visible: false, data: null });

  constructor(@Inject(REPOSITORY_SERVICE) private repositorySvc: Repository<T>) {
    this.isVisible$ = this.isVisibleSbj.asObservable();
  }

  /** An optional initial value for the form.*/
  formData = signal<T | null>(null);
  /** State used for button spinners. */
  formState = signal<'submit' | 'delete' | null>(null);
  /** Is the form valid or invalid. */
  formIsValid = signal(false);

  openModal(item: T | null = null) {
    this.formData.set(item);
    this.isVisibleSbj.next({ visible: true, data: this.formData() });
  }

  closeModal() {
    this.isVisibleSbj.next({ visible: false, data: null });
  }

  submitForm(form: any, update: boolean) {
    this.formState.set('submit');
    const submit$ = update ? this.repositorySvc.update(form) : this.repositorySvc.create(form);

    return submit$.pipe(tap(() => this.closeModal()));
  }

  deleteItem() {
    this.formState.set('delete');
    return this.repositorySvc.delete(this.formData()!.id).pipe(tap(() => this.closeModal()));
  }

  updateStatus(isValid: boolean) {
    this.formIsValid.set(isValid);
  }

  /** Execute cleanup code when the modal is closed. */
  destroy() {
    this.formData.set(null);
    this.formState.set(null);
    this.formIsValid.set(false);
  }
}
