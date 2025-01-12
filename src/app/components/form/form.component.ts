import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

export abstract class FormComponent {
  public abstract form: FormGroup<any>;
  protected abstract statusChanged: EventEmitter<boolean>;

  reset(value?: unknown) {
    this.form?.reset(value);
  }
}
