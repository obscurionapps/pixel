declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { Messages } from '../common/constants';
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ReportedIssues } from '../models/reportedIssue';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from '../notification/notification.component';
import { BreadCrumb } from '../models/Custom';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-viewissue',
  standalone: true,
  providers: [CommonUtilities],
  imports: [BreadcrumbComponent, ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule, NgbModule, NotificationComponent],
  templateUrl: './viewissue.component.html',
  styleUrl: './viewissue.component.css'
})
export class ViewissueComponent implements OnInit {
constructor(private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router, private route: ActivatedRoute) { }
  isLoading = false;
  reportedIssues_full_list: ReportedIssues[] = [];
  reportedIssues_user: ReportedIssues[] = [];
  isEmptyGrid = false;
  p: number = 1;
  filterForm!: FormGroup;
  formattedEndate = "";
  formattedStartDate = "";
  filterKeys: string[] = [];
  filterDateError = false;
  Message = "";
  filter_Start_Date = "";
  filter_end_Date = "";
  filter_part_number = "";
  searchPartno="";
  userRole="";
  enableNotification_success=false;
  enableNotification_failure=false;
  breadcrumb_data:BreadCrumb[]=[{"title":"Dashboard", "route":"/home", "active":false}, {"title":"Defect records", "route":"/viewissue", "active":true}
    ];
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled)
      this.router.navigate(['login']);
    this.userRole = localStorage.getItem(LocalStorageConstant.UserRole) ?? "";
    this.filterForm = new FormGroup({
      part_number: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl('')
    });
    this.getIssues();
  }
  retainFilter():void{
    const admin_date = localStorage.getItem(LocalStorageConstant.IssueSearch_userdate)??"";
    const admin_number = localStorage.getItem(LocalStorageConstant.IssueSearch_user_p_no)??"";
    if((admin_date != null && admin_date != undefined) || (admin_number != null && admin_number != undefined)){
      this.filter_Start_Date = admin_date ?? "";
      this.filter_part_number = admin_number ?? "";
      this.applyFilter();
    }
  }
  getIssues(): void {
    this.reportedIssues_full_list = this.commonUtilities.getReportedIssuesFromLocalStorageForUser();
    if (this.reportedIssues_full_list != null && this.reportedIssues_full_list != undefined && this.reportedIssues_full_list.length > 0) {
      this.reportedIssues_user = this.commonUtilities.removeDuplicatesByKey(this.reportedIssues_full_list, "part_number");
      this.retainFilter();
    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.GetReportIssue, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            this.reportedIssues_full_list = resultData.resultJson;
            localStorage.setItem(LocalStorageConstant.reportedIssuesUser, JSON.stringify(resultData.resultJson));
            this.reportedIssues_user = this.commonUtilities.removeDuplicatesByKey(this.reportedIssues_full_list, "part_number");
            if (this.reportedIssues_user !== null && this.reportedIssues_user.length <= 0) {
              this.isEmptyGrid = true;
            }
            else {
              this.isEmptyGrid = false;
            }
            this.retainFilter();
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
          }
        }
      });
    }
  }
  refreshIssueGrid(): void {
    this.filterForm.markAllAsTouched(); 
    this.filterForm.updateValueAndValidity();
    localStorage.removeItem(LocalStorageConstant.reportedIssuesUser);
    this.getIssues();
  }
  applyFilterOptions(): void {
    const modalElement = document.getElementById('filtermodal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }
  onDateSelected(date: NgbDateStruct, criteria: string) {
    if (criteria === "enddate") {
      this.formattedEndate = `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
    }
    else if (criteria == "startdate") {
      this.formattedStartDate = `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
    }
  }
  applyFilter() {
    const filter_part_number = this.filterForm.get("part_number")?.value;
    const filter_start_date = this.formattedStartDate;
    const filter_end_date = this.formattedEndate;
    if (filter_start_date != null && filter_start_date != "" && filter_start_date != undefined) {
      const parsed_start_date = this.commonUtilities.parseDate(filter_start_date);
      if (filter_end_date != null && filter_end_date != "" && filter_end_date != undefined) {
        const parsed_end_date = this.commonUtilities.parseDate(filter_end_date);
        if (parsed_end_date < parsed_start_date) {
          this.filterDateError = true;
          this.Message = Messages.DateErrorMessage;
        }
        else {
          this.filterDateError = false;
          this.filter_Start_Date = filter_start_date;
          this.filter_end_Date = filter_end_date;
        }
      }
      else {
        this.filterDateError = false;
        this.filter_Start_Date = filter_start_date;
        localStorage.setItem(LocalStorageConstant.IssueSearch_userdate, this.filter_Start_Date);
      }
    }
    if (filter_part_number != null && filter_part_number != undefined && filter_part_number != "") {
      this.filter_part_number = filter_part_number;
      localStorage.setItem(LocalStorageConstant.IssueSearch_user_p_no, this.filter_part_number);
    }
    this.reportedIssues_full_list = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssuesUser) ?? "").filter((s:any) => (s.part_number?.toString().toLowerCase() == this.filter_part_number?.toString().toLowerCase() || this.filter_part_number == "" || this.filter_part_number == null) &&
      (this.commonUtilities.areDatesEqual(s.date, this.filter_Start_Date) || this.filter_Start_Date == "" || this.filter_Start_Date == null) &&
      ((this.commonUtilities.isDateBetween(s.date, this.filter_Start_Date, this.filter_end_Date) ||
        this.filter_end_Date == "")));
    this.reportedIssues_user = this.commonUtilities.removeDuplicatesByKey(this.reportedIssues_full_list, 'part_number');
  }
  removeFilter(item:string):void{
    if(item == "partnumber"){
      this.filter_part_number = "";
      this.filterForm.get("part_number")?.reset();
      localStorage.removeItem(LocalStorageConstant.IssueSearch_user_p_no);
    }
    if(item == "date"){
      this.filter_Start_Date = "";
      this.formattedStartDate = "";
      localStorage.removeItem(LocalStorageConstant.IssueSearch_userdate);
    }
    this.applyFilter();
  }
  loadIssueDetail(part_number: string): void {
    if (part_number != null && part_number != "") {
      this.router.navigate(['issue_details'], {
        queryParams: {
          part: part_number
        }
      });
    }
  }
}
