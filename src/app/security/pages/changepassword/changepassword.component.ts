import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(4)]],
      npassword: [null, [Validators.required, Validators.minLength(4)]]
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.f['password'].value === this.f['npassword'].value) {
      this.error = 'La nueva contraseña debe ser diferente a la anterior';
      this.loading = false;
      return;
    }
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    this.authenticationService.changepassword(this.f['username'].value, this.f['password'].value, this.f['npassword'].value)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // get return url from route parameters or default to '/' 
          if (user == null) {
            this.loading = false;
            this.error = 'Verifique los datos ingresados';
            return;
          }
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}