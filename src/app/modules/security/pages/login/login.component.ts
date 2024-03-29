import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/security/service/authentication.service';
import { UserRequest } from '../../dtos/userRequest.interface copy';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; 
  submitted = false;
  error = '';

  userRequest: UserRequest = {
    user: null,
    password: null,
    nPassword: null
  };
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
      password: [null, [Validators.required, Validators.minLength(4)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.error = ''; 

    this.userRequest.user = this.f['username'].value;
    this.userRequest.password = this.f['password'].value;
    this.authenticationService.login(this.userRequest)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // get return url from route parameters or default to '/' 
          if (user == null) { 
            this.error = 'Verifique los datos ingresados';
            this.submitted = false;
            return;
          }
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: error => {
          this.error = error;
          this.submitted = false;
        }
      });
  }
}