import { Component, OnInit } from '@angular/core';
import { LocalStorageConstant } from '../common/constants';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonUtilities } from '../common/CommonUtilities';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadCrumb } from '../models/Custom';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-home',
  standalone: true,
  providers:[CommonUtilities],
  imports: [HeaderComponent, FormsModule, CommonModule,RouterModule,BreadcrumbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private commonUtilities:CommonUtilities) { }
    quickLinks = [
    { title: 'Dashboard', icon: '📦', route: '/home', description: 'Manage all parts', has_access:'all' },
    { title: 'Profile', icon: '👤', route: '/profile', description: 'Your user profile', has_access:'all' },
    { title: 'Part Matrix Search', icon: '⚙️', route: '/matrixsearch', description: 'Find the parts in shelf', has_access:'all' },
    { title: 'Parts Matrix Setup', icon: '📊', route: '/partmaxtrix', description: 'Configure the matrix', has_access:'admin' },
    { title: 'Parts Detail', icon: '📊', route: '/specdetail', description: 'Parts and Specifications', has_access:'all' },
    { title: 'Setup Parts', icon: '⚙️', route: '/addSpecification', description: 'Configure new parts', has_access:'admin' },
    { title: 'Report an Issue', icon: '🔒', route: '/reportissue_grid', description: '',  has_access:'all' },
    { title: 'Defect Records', icon: '🔒', route: '/viewissue', description: '',  has_access:'all' },
    { title: 'Requests', icon: '🔒', route: '/viewrequest', description: '',  has_access:'all' },
  ];
  breadCrumb_Data:BreadCrumb[]=[{ title: 'Dashboard', route:'home', active:true }];
  loginname:string = "";
  userRole:string="";
  ngOnInit(): void {
    if(!this.commonUtilities.isAccessEnabled())
      this.router.navigate(['login']);
    this.getUsernameAndRole();
  }
  getUsernameAndRole():void{
    this.loginname = localStorage.getItem(LocalStorageConstant.LoginName) ?? "";
    this.userRole = localStorage.getItem(LocalStorageConstant.UserRole)??"";
  }
  reportIssue():void{
    localStorage.removeItem(LocalStorageConstant.reportedIssues);
    this.router.navigate(['reportissue_grid']);
  }
  viewReportIssue():void{
    localStorage.removeItem(LocalStorageConstant.reportedIssuesUser);
    this.router.navigate(['viewissue']);  
  }
  accountRequests():void{
    localStorage.removeItem(LocalStorageConstant.AccountRequests);
    this.router.navigate(['viewrequest']);
  }
  creatematrix():void{
    localStorage.removeItem(LocalStorageConstant.MatrixDetails);
    this.router.navigate(['partmaxtrix']);
  }
}