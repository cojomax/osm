import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase/firebase.auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
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
