import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container">
    <div class="heading">LOGIN</div>
    <form class="form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <input
        formControlName="username"
        placeholder="Username"
        id="email"
        name="email"
        type="email"
        class="input"
        required=""
      />
      <input
        formControlName="password"
        placeholder="Password"
        id="password"
        name="password"
        type="password"
        class="input"
        required=""
      />
      <input value="Entrar" type="submit" class="login-button" />
    </form>
    <span class="agreement"><a href="#">Prueba Tecnica</a></span>
  </div>
  `,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group<LoginForm>({
      username: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const payload = this.loginForm.getRawValue();
    this.auth.login(payload).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Error en login');
      }
    });
  }
}
