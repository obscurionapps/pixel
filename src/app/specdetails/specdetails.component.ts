declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { PartSpecDetail, specification, SpecJSON } from '../models/PartSpecDetail';
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-specdetails',
  standalone: true,
  providers: [CommonUtilities],
  imports: [ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule],
  templateUrl: './specdetails.component.html',
  styleUrl: './specdetails.component.css'
})
export class SpecdetailsComponent implements OnInit {
  btnLabel: string = 'Save';
  constructor(private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router) { }
  isLoading = false;
  isEmptyGrid = false;
  partSpecDetail: PartSpecDetail[] = [];
  part_number_search: string = "";
  p: number = 1;
  q: number = 1;
  specificForm!: FormGroup;
  specificationItems: specification[] = [];
  loginRole="";
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled())
      this.router.navigate(['login']);
    this.specificForm = new FormGroup({
      part_number: new FormControl('', [Validators.required]),
      control_plan_no: new FormControl('', Validators.required),
      drawing_no: new FormControl('', Validators.required),
      issue: new FormControl(''),
      remedy: new FormControl('')
    });
    this.loginRole = this.commonUtilities.getRole();
    this.getPartSpecDetail();
  }
  getPartSpecDetail(): void {
    this.partSpecDetail = this.commonUtilities.getPartSpecDetailFromLocalStorage();
    if (this.partSpecDetail != null && this.partSpecDetail != undefined && this.partSpecDetail.length > 0) {
    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.PartSpecDetail, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            console.log(resultData);
            localStorage.setItem(LocalStorageConstant.partSpecDetail, JSON.stringify(resultData.resultJson));
            this.partSpecDetail = resultData.resultJson;
            if (this.partSpecDetail !== null && this.partSpecDetail.length <= 0) {
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
  filteredParts(): PartSpecDetail[] {
    if (this.part_number_search !== '') {
      return this.partSpecDetail.filter(part =>
        String(part.part_number).toLowerCase().includes(this.part_number_search.toLowerCase())
      );
    }
    else {
      return this.partSpecDetail;
    }
  }
  openAddWindow(part: PartSpecDetail | null) {
    if (part != null) {

    }
    else {
      this.router.navigate(['addSpecification']);
    }
  }
  Refresh(): void {
    localStorage.removeItem(LocalStorageConstant.partSpecDetail);
    this.getPartSpecDetail();
  }
  updatePartSpec(part: PartSpecDetail): void {
    if (part != null && part.id.length > 0) {
      this.router.navigate(['addSpecification'], {
        queryParams: {
          id: part.id
        }
      });
    }
  }
}
