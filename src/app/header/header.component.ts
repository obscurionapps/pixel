import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageConstant, Roles } from '../common/constants';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private router : Router) { }
  isOffCanvasOpen = false;
  isAdmin = false;
  loginname="";
  ngOnInit(): void {
    this.getUserRole();
  }
  toggleOffCanvas() {
    this.isOffCanvasOpen = !this.isOffCanvasOpen;
  }
  getUserRole():void{
    if(localStorage.getItem(LocalStorageConstant.UserRole)){
      const role = localStorage.getItem(LocalStorageConstant.UserRole);
      this.loginname = localStorage.getItem(LocalStorageConstant.LoginName) ?? "";
      if(role == Roles.Admin){
        this.isAdmin = true;
      }
      else{
        this.isAdmin = false;
      }
    }
  } 
  logout():void{
    localStorage.clear();
    this.router.navigate(['login']);
  } 
  homepage():void{
    this.router.navigate(['home']);
  }
    reportIssue():void{
    localStorage.removeItem(LocalStorageConstant.reportedIssues);
    this.router.navigate(['reportissue_grid']);
  }
    viewReportIssue():void{
    localStorage.removeItem(LocalStorageConstant.reportedIssuesUser);
    this.router.navigate(['viewissue']);  
  }
   creatematrix():void{
    localStorage.removeItem(LocalStorageConstant.MatrixDetails);
    this.router.navigate(['partmaxtrix']);
  }
    accountRequests():void{
    localStorage.removeItem(LocalStorageConstant.AccountRequests);
    this.router.navigate(['viewrequest']);
  }
}
