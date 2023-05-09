import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  currentStatus: string = '';
  currentStatusText: string = '';
  registrationForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      this.currentStatus = 'loading';
      this.currentStatusText = 'Регистрация в системе...';

      try {
        const res = await lastValueFrom(
          this.authService.register(this.registrationForm.value)
        );
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.currentStatus = 'error';
          this.currentStatusText = 'Ошибка регистрации';
        }
      } catch (error: any) {
        this.currentStatus = 'error';
        this.currentStatusText = error.message;
      }
    }
  }
}
