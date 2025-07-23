import { Component, OnInit } from '@angular/core';
import { LocalStorageConstant } from '../common/constants';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.getAccessToken();
  }
  getAccessToken(): void {
    if (localStorage.getItem(LocalStorageConstant.AccessToken)) {
      
    }
    else {
      this.router.navigate(['login']);
    }
  }
}