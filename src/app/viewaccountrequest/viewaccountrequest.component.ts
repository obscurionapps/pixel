declare var bootstrap: any;
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';;
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { AccountRequest } from '../models/Custom';

@Component({
  selector: 'app-viewaccountrequest',
  standalone: true,
  providers: [CommonUtilities],
  imports: [ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule, NotificationComponent],
  templateUrl: './viewaccountrequest.component.html',
  styleUrl: './viewaccountrequest.component.css'
})
export class ViewaccountrequestComponent implements OnInit {
  @ViewChild('closeRequest') closeModalBtn!: ElementRef;
  constructor(private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router, private route: ActivatedRoute) { }
  accountRequests: AccountRequest[] = [];
  isLoading = false;
  isSuccess = false;
  Message = '';
  isError = false;
  p: number = 1;
  registerForm!: FormGroup;
  selectedRequest: AccountRequest = {
    email: '',
    firstname: '',
    id: '',
    is_read: '',
    lastname: ''
  }
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled()) {
      this.router.navigate(['login']);
    }
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.loadRequests();
  }
  loadRequests(): void {
    debugger;
    this.accountRequests = this.commonUtilities.getAccountRequests();
    if (this.accountRequests != null && this.accountRequests != undefined && this.accountRequests.length > 0) {

    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.getAccountRequest, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            console.log(resultData);
            this.accountRequests = resultData.resultJson;
            localStorage.setItem(LocalStorageConstant.AccountRequests, JSON.stringify(this.accountRequests));
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
            this.Message = resultData.message;
            this.isError = true;
          }
        }
      });
    }
  }
  refresh(): void {
    localStorage.removeItem(LocalStorageConstant.AccountRequests);
    this.loadRequests();
  }
  addUser(userReq: AccountRequest): void {
    if (userReq != null && userReq != undefined) {
      this.selectedRequest = {
        email: userReq.email,
        firstname: userReq.firstname,
        id: userReq.id,
        is_read: userReq.is_read,
        lastname: userReq.lastname
      }
      this.openModal(this.selectedRequest);
    }
  }
  register(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.appService.post(methodConstant.Registration, {
        username: this.registerForm.get("username")?.value,
        password: this.registerForm.get("password")?.value,
        first_name: this.registerForm.get("firstname")?.value,
        last_name: this.registerForm.get("lastname")?.value,
        email: this.registerForm.get("email")?.value,
        reqId: this.selectedRequest.id
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            this.isLoading = false;
            this.isSuccess = true;
            this.Message = "User is added to the system successfully."
            const existing_Json = localStorage.getItem(LocalStorageConstant.AccountRequests);
            if (existing_Json != null && existing_Json != undefined) {
              const existing_Json_parse = JSON.parse(existing_Json);
              const index = existing_Json_parse.findIndex((s: AccountRequest) => s.id == this.selectedRequest.id);
              if (index > -1) {
                existing_Json_parse.splice(index, 1);
              }
              localStorage.setItem(LocalStorageConstant.AccountRequests, JSON.stringify(existing_Json_parse));
              this.accountRequests = existing_Json_parse;
            }
            this.registerForm.reset();
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
  openModal(request: AccountRequest | null) {
    if (request != null) {
      this.registerForm.get("firstname")?.patchValue(request.firstname);
      this.registerForm.get("lastname")?.patchValue(request.lastname);
      this.registerForm.get("email")?.patchValue(request.email);
    }
    const modalElement = document.getElementById('useraddmodal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }
}
