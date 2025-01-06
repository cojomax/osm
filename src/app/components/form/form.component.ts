import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export abstract class FormComponent {
  abstract form: FormGroup<any>;

  // abstract isFormValid: WritableSignal<boolean>;

  abstract updateForm(): void;

  abstract formUpdated$: Observable<boolean>;
}
