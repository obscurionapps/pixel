import { Component, OnInit } from '@angular/core';
import { LocalStorageConstant } from '../common/constants';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonUtilities } from '../common/CommonUtilities';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  providers:[CommonUtilities],
  imports: [HeaderComponent, FormsModule, CommonModule,RouterModule],
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
    { title: 'Logout', icon: '🔒', route: '/login', description: 'Sign out securely',  has_access:'all' },
  ];
  loginname:string = "";
  userRole:string="";
  ngOnInit(): void {
    if(!this.commonUtilities.isAccessEnabled())
      this.router.navigate(['login']);
    this.getUsernameAndRole();
    if(this.userRole === 'user'){
      this.quickLinks= this.quickLinks.filter(s=>s.has_access == 'all');
    }
  }
  getUsernameAndRole():void{
    this.loginname = localStorage.getItem(LocalStorageConstant.LoginName) ?? "";
    this.userRole = localStorage.getItem(LocalStorageConstant.UserRole)??"";
  }
}