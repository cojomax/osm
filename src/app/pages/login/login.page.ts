import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzFormModule } from '@nz/form';
import { NzIconModule } from '@nz/icon';
import { NzInputModule } from '@nz/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FirebaseAuthService } from '../../services/firebase/firebase.auth.service';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPageComponent implements OnInit {
  protected loginForm!: FormGroup<any>;

  constructor(private _auth: FirebaseAuthService) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    console.log('Submitted!', this.loginForm.value);
    this._auth.createWithCredentials(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
  }
}
