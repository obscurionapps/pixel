import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumb } from '../models/Custom';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit{
  @Input() breadcrumb_data : BreadCrumb[] = [];
  ngOnInit(): void {
    
  }
}
