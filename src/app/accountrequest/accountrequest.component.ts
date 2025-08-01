import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';
import { methodConstant, LocalStorageConstant } from '../common/constants';
import { ScriptService } from '../service/appscript.service';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-accountrequest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, AlertsComponent],
  templateUrl: './accountrequest.component.html',
  styleUrl: './accountrequest.component.css'
})
export class AccountrequestComponent implements OnInit{
  constructor(private router: Router, private appService: ScriptService) { }
  requestForm!: FormGroup;
  isLoading = false; 
  isSuccess = false;
  Message = '';
  isError = false;

  ngOnInit(): void {
    localStorage.clear();
    this.requestForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl(''),
      email: new FormControl('')
    });
  }
  requestAccount():void{
    if(this.requestForm.valid){
      const firstname = this.requestForm.get("firstname")?.value;
      const lastname = this.requestForm.get("lastname")?.value;
      const email = this.requestForm.get("email")?.value;
      this.isLoading = true;
      this.appService.post(methodConstant.AccountRequest, {
        firstname:firstname,
        lastname:lastname,
        email:email
      }).subscribe(result => {
        if(result){
          const resultData : any = result;
          if(resultData.status == 'Success')
          {
          this.isLoading = false;
          this.requestForm.reset();
          this.Message = "Your request has been submitted successfully. An administrator will review it and create your account shortly.";
          this.isError=false;
          this.isSuccess = true;
          }
          else{
            this.isLoading = false;
            this.requestForm.reset();
            this.Message = resultData.message;
            this.isError = true;
          }
        }
      });
    }
    else{
      this.requestForm.markAllAsTouched();
    }
  }
   login(): void {
    this.router.navigate(['login']);
  }
}
