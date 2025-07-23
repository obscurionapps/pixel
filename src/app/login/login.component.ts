import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScriptService } from '../service/appscript.service';
import { methodConstant, LocalStorageConstant } from '../common/constants';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, AlertsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  invalidResponse:string = "";
  isLoading = false;
  isError = false;
  Message = '';
  constructor(private appService: ScriptService,private router: Router ) {
  }
  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.appService.post(methodConstant.Authentication, {
        username: this.loginForm.get("username")?.value,
        password: this.loginForm.get("password")?.value
      }).subscribe(result => {
        if(result){
          const resultData : any = result;
          if(resultData.status == 'Success')
          {
          localStorage.setItem(LocalStorageConstant.AccessToken, resultData.resultJson.token);
          localStorage.setItem(LocalStorageConstant.UserRole, resultData.resultJson.role);
          this.isLoading = false;
          this.router.navigate(['home']);
          }
          else{
            this.isLoading = false;
            this.loginForm.reset();
            this.Message = resultData.message;
            this.isError = true;
          }
        }
      });
    }
  }
  register():void{
    this.router.navigate(['register']);
  }
}
