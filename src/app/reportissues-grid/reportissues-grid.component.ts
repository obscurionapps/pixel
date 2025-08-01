declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { Messages } from '../common/constants';
import { PartSpecDetail, specification, SpecJSON } from '../models/PartSpecDetail';
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ReportedIssues } from '../models/reportedIssue';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-reportissues-grid',
  standalone: true,
  providers: [CommonUtilities],
  imports: [ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule, NgbModule, NotificationComponent],
  templateUrl: './reportissues-grid.component.html',
  styleUrl: './reportissues-grid.component.css'
})
export class ReportissuesGridComponent implements OnInit {
  constructor(private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router, private route: ActivatedRoute) { }
  isLoading = false;
  reportedIssues: ReportedIssues[] = [];
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
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled)
      this.router.navigate(['login']);
    this.userRole = localStorage.getItem(LocalStorageConstant.UserRole) ?? "";
    if (localStorage.getItem("status") == "1") {
      this.enableNotification_success = true;
      this.enableNotification_failure = false;
    }
    else if (localStorage.getItem("status") == "0") {
      this.enableNotification_success = false;
      this.enableNotification_failure = true;
    }
    localStorage.removeItem("status");
    this.filterForm = new FormGroup({
      part_number: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl('')
    });
    this.getIssues();
  }
  getIssues(): void {
    this.reportedIssues = this.commonUtilities.getReportedIssuesFromLocalStorage();
    if (this.reportedIssues != null && this.reportedIssues != undefined && this.reportedIssues.length > 0) {

    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.GetReportIssue, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            localStorage.setItem(LocalStorageConstant.reportedIssues, JSON.stringify(resultData.resultJson));
            this.reportedIssues = resultData.resultJson;
            if (this.reportedIssues !== null && this.reportedIssues.length <= 0) {
              this.isEmptyGrid = true;
            }
            else {
              this.isEmptyGrid = false;
            }
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
    localStorage.removeItem(LocalStorageConstant.reportedIssues);
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
      }
    }
    if (filter_part_number != null && filter_part_number != undefined && filter_part_number != "") {
      this.filter_part_number = filter_part_number;
    }
    this.reportedIssues = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssues) ?? "").filter((s:any) => (s.part_number == this.filter_part_number || this.filter_part_number == "" || this.filter_part_number == null) &&
      (this.commonUtilities.areDatesEqual(s.date, this.filter_Start_Date) || this.filter_Start_Date == "" || this.filter_Start_Date == null) &&
      ((this.commonUtilities.isDateBetween(s.date, this.filter_Start_Date, this.filter_end_Date) ||
        this.filter_end_Date == "")));
    
  }
  removeFilter(item:string):void{
    if(item == "partnumber"){
      this.filter_part_number = "";
      this.filterForm.get("part_number")?.reset();
    }
    if(item == "date"){
      this.filter_Start_Date = "";
      this.formattedStartDate = "";
      this.filterForm.get("start_date")?.reset();
    }
    this.applyFilter();
  }
  addNewIssue():void{
    this.router.navigate(['reportissue']);
  }
  editIssue(issue_id:string):void{
    if(issue_id != null && issue_id != ""){
        this.router.navigate(['reportissue'], {
        queryParams: {
          id: issue_id
        }
      });
    }
  }
}
