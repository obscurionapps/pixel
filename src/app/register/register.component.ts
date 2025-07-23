import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';
import { methodConstant, LocalStorageConstant } from '../common/constants';
import { ScriptService } from '../service/appscript.service';
import { AlertsComponent } from '../alerts/alerts.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, AlertsComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private appService: ScriptService) { }
  isLoading = false;
  registerForm!: FormGroup;
  isSuccess = false;
  Message = '';
  isError = false;
  ngOnInit(): void {
    localStorage.clear();
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  login(): void {
    this.router.navigate(['login']);
  }
  register(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.appService.post(methodConstant.Registration, {
        username: this.registerForm.get("username")?.value,
        password: this.registerForm.get("password")?.value,
        first_name: this.registerForm.get("firstname")?.value,
        last_name: this.registerForm.get("lastname")?.value,
        email: this.registerForm.get("email")?.value
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            this.isLoading = false;
            this.isSuccess = true;
            this.Message = resultData.message + " Please wait.";
            this.registerForm.reset();
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 3000);
          }
          else {
            this.isError = true;
            this.Message = resultData.message;
            this.isLoading = false;
          }
        }
      });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
}
