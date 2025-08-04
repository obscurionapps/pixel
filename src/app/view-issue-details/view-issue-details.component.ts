import { Component, OnInit } from '@angular/core';
import { CommonUtilities } from '../common/CommonUtilities';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPartDetail, reportView } from '../models/Custom';
import { ReportedIssues } from '../models/reportedIssue';
import { LocalStorageConstant } from '../common/constants';
import { HeaderComponent } from '../header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common'; 
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreadCrumb } from '../models/Custom';
@Component({
  selector: 'app-view-issue-details',
  standalone: true,
  providers: [CommonUtilities],
  imports: [BreadcrumbComponent, HeaderComponent, NgxPaginationModule, CommonModule],
  templateUrl: './view-issue-details.component.html',
  styleUrl: './view-issue-details.component.css'
})
export class ViewIssueDetailsComponent implements OnInit {
  constructor(private commonUtility: CommonUtilities, private router: Router, private route: ActivatedRoute) { }
  breadcrumb_data:BreadCrumb[]=[{"title":"Dashboard", "route":"/home", "active":false}, {"title":"Defect records", "route":"/viewissue", "active":false},
    {"title":"Defect record detail", "route":"/issue_details", "active":true}
  ];
  selectedPartCommonDetail: CommonPartDetail = {
    control_plan_no: '',
    drawing_number: '',
    part_number: '',
    createdby:''
  };
  isLoading=false;
  isOverlayOpen = false;
  zoomLevel = 1;
  p: number = 1;
  reportView: reportView[] = [];
  reportedIssues_byPart: ReportedIssues[] = [];
  part_numberToFind = "";
  defect_image:string = "";
  ngOnInit(): void {
    if (!this.commonUtility.isAccessEnabled()) {
      this.router.navigate(['login']);
    }
    this.route.queryParams.subscribe(params => {
      this.part_numberToFind = params['part'];
    });
    this.loadIssues();
  }
  loadIssues(): void {
    this.reportedIssues_byPart = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssuesUser) ?? "");
    if (this.reportedIssues_byPart != null && this.reportedIssues_byPart != undefined && this.reportedIssues_byPart.length > 0) {
      this.reportedIssues_byPart = this.reportedIssues_byPart.filter(s => s.part_number === this.part_numberToFind);
    }
    if (this.reportedIssues_byPart != null && this.reportedIssues_byPart.length > 0) {
      this.selectedPartCommonDetail = {
        control_plan_no: this.reportedIssues_byPart[0].control_plan_no,
        drawing_number: this.reportedIssues_byPart[0].drawing_number,
        part_number: this.reportedIssues_byPart[0].part_number,
        createdby:this.reportedIssues_byPart[0].created_by
      }
      this.reportView = this.reportedIssues_byPart.map((s) => {
        return {
          date: s.date,
          problem: s.problem,
          remarks: s.remarks,
          impact: s.imapct,
          image: s.defect_image,
          specification: JSON.parse(s.specification),
          actions: JSON.parse(s.actions),
          issue_type: s.issue_type,
          disposition:s.disposition
        }
      }); 
    }
  }
  openOverlay(imageurl:string) {
    this.defect_image=imageurl;
    this.isOverlayOpen = true;
    this.zoomLevel = 1;
  }
  closeOverlay() {
    this.isOverlayOpen = false;
  }
  goBack():void{
    this.router.navigate(['viewissue']);
  }
}
