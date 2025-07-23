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
  ngOnInit(): void {
    this.getUserRole();

  }
  toggleOffCanvas() {
    this.isOffCanvasOpen = !this.isOffCanvasOpen;
  }
  getUserRole():void{
    if(localStorage.getItem(LocalStorageConstant.UserRole)){
      const role = localStorage.getItem(LocalStorageConstant.UserRole);
      if(role == Roles.Admin){
        this.isAdmin = true;
      }
      else{
        this.isAdmin = false;
      }
    }
  }
  partMatrixSetup():void{
    this.router.navigate(['partmaxtrix']);
  }
  logout():void{
    localStorage.clear();
    this.router.navigate(['login']);
  }
  openPartsSearch():void{
    this.router.navigate(['matrixsearch']);
  }
}
