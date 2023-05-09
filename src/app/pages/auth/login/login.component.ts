import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  currentStatus: string = '';
  currentStatusText: string = '';

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.currentStatus = 'loading';
      this.currentStatusText = 'Вход в систему...';

      try {
        const res = await lastValueFrom(
          this.authService.login(this.loginForm.value)
        );
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.currentStatus = 'error';
          this.currentStatusText = 'Ошибка авторизации';
        }
      } catch (error: any) {
        this.currentStatus = 'error';
        this.currentStatusText = error.message;
      }
    }
  }

  getErrorMessage(controlName: string) {
    if (this.loginForm.controls[controlName].hasError('required')) {
      return 'Поле обязательно для заполнения';
    }
    if (
      controlName === 'email' &&
      this.loginForm.controls[controlName].hasError('email')
    ) {
      return 'Введен некорректная электронная почта';
    }
    return '';
  }
}
