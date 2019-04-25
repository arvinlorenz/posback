import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  emailErrorMessage
  passwordErrorMessage
  constructor(private authService: AuthService, private router: Router)  { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  login(){
    if(this.form.invalid){
      this.form.reset();
      this.emailErrorMessage = "Please enter a valid email"
      this.passwordErrorMessage = "Please enter a password"
      return;
    }

    this.authService.signinUser(this.form.value.email, this.form.value.password);
    this.authService.authTokenUpdateListener()
      .subscribe(token=>{
        if(token){
          this.router.navigate(['/']);
        }
        else{
          this.form.controls['email'].setErrors({});
          this.form.controls['password'].setErrors({});
          this.emailErrorMessage = "Email and Password did not match"
          this.passwordErrorMessage = "Email and Password did not match"
        }
      })
    
  }
}
