declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { AppComponent } from '../app.component';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { ScriptService } from '../service/appscript.service';
import { PartsMatrix } from '../models/partsMatrix';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { Router } from '@angular/router';
import { Matrix, MatrixViewEntity } from '../models/Custom';
import { NotificationComponent } from '../notification/notification.component';
@Component({
  selector: 'app-part-matrix',
  standalone: true,
  providers: [CommonUtilities],
  imports: [NotificationComponent, ReactiveFormsModule, FormsModule, HeaderComponent, CommonModule, NgxPaginationModule, LoaderComponent, AlertsComponent, AppComponent],
  templateUrl: './part-matrix.component.html',
  styleUrl: './part-matrix.component.css'
})
export class PartMatrixComponent implements OnInit {
  constructor(private appService: ScriptService, private commonUtilities: CommonUtilities, private router: Router) { }
  p: number = 1;
  partMatrixDetail: PartsMatrix[] = [];
  isLoading = false;
  partsMatrixForm!: FormGroup;
  selectedPart!: PartsMatrix;
  part_number!: string;
  column_number!: string;
  row_number!: string;
  created_date!: string;
  created_by!: string;
  id!: string;
  btnLabel: string = 'Save';
  isError: boolean = false;
  Message = "";
  part_number_search: string = '';
  isEmptyGrid = false;
  matrixDetails: Matrix[] = [];
  matrixViewDataDetails: MatrixViewEntity[] = [];
  enableNotification_success = false;
  enableNotification_failure = false;
  filter_part_number = "";
  filterForm!: FormGroup;
  matrixId = "";
  login_role = "";
  ngOnInit(): void {
    var has_Access = this.commonUtilities.isAccessEnabled();
    if (!has_Access)
      this.router.navigate(['login']);
    this.login_role = this.commonUtilities.getRole();
    this.filterForm = new FormGroup({
      part_number: new FormControl('')
    });
    if (localStorage.getItem("status") == "1") {
      this.enableNotification_success = true;
      this.enableNotification_failure = false;
    }
    else if (localStorage.getItem("status") == "0") {
      this.enableNotification_success = false;
      this.enableNotification_failure = true;
    }
    localStorage.removeItem("status"); 
    this.getMatrixDetails();
    if(localStorage.getItem(LocalStorageConstant.MatrixSearch) != null && localStorage.getItem(LocalStorageConstant.MatrixSearch) != undefined && localStorage.getItem(LocalStorageConstant.MatrixSearch) != "")
    {
      this.filter_part_number = localStorage.getItem(LocalStorageConstant.MatrixSearch) ?? "";
      this.applyFilter();
      this.filterForm.get("part_number")?.patchValue(this.filter_part_number);
    }
  }
  getMatrixDetails(): void {
    this.matrixDetails = this.commonUtilities.getMatrixDetails();
    if (this.matrixDetails != null && this.matrixDetails != undefined && this.matrixDetails.length > 0) {
      this.matrixViewDataDetails = this.matrixDetails.map((s) => {
        return {
          book_data: JSON.parse(s.book_data),
          control_plan_data: JSON.parse(s.control_plan_data),
          control_plan_number: s.control_plan_number,
          created_date: s.created_date,
          createdby: s.created_by,
          id: s.id,
          is_active: s.is_active,
          part_number: s.part_number,
          plant: s.plant
        }
      });
    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.GetMatrixDetail, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            localStorage.setItem(LocalStorageConstant.MatrixDetails, JSON.stringify(resultData.resultJson));
            this.matrixDetails = resultData.resultJson;
            this.matrixViewDataDetails = this.matrixDetails.map((s) => {
              return {
                book_data: JSON.parse(s.book_data),
                control_plan_data: JSON.parse(s.control_plan_data),
                control_plan_number: s.control_plan_number,
                created_date: s.created_date,
                createdby: s.created_by,
                id: s.id,
                is_active: s.is_active,
                part_number: s.part_number,
                plant: s.plant
              }
            });
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
          }
        }
      });
    }
  }
  addNewMatrix() {
    this.router.navigate(['manageMatrix']);
  }
  editMatrix(matrix: MatrixViewEntity) {
    if (matrix != null && matrix != undefined) {
      const id = matrix.id;
      this.router.navigate(['manageMatrix'], {
        queryParams: {
          id: id
        }
      });
    }
  }
  openModal(part: PartsMatrix | null) {
    if (part != null) {
      this.btnLabel = 'Update';
      this.part_number = part.part_number;
      this.row_number = part.row_number;
      this.column_number = part.column_number;
      this.created_date = part.created_date;
      this.created_by = part.created_by;
      this.id = part.id;
    }
    else {
      this.btnLabel = 'Save';
    }
    const modalElement = document.getElementById('partsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }
  deleteConfirm(matrix: MatrixViewEntity){
    this.matrixId  = matrix.id;
     const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  } 
  delete(): void {
    this.isLoading = true;
    this.appService.post(methodConstant.DeleteMatrix, {
      id: this.matrixId
    }).subscribe(result => {
      if (result) {
        const resultData: any = result;
        if (resultData.status == 'Success') {
          this.isError = false;
          var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.MatrixDetails) ?? "");
          existing_Json = existing_Json.filter((s: { id: string; }) => s.id !== resultData.resultJson.id);
          this.matrixDetails = existing_Json;
          localStorage.setItem(LocalStorageConstant.MatrixDetails, JSON.stringify(existing_Json));
          this.matrixViewDataDetails = this.matrixDetails.map((s) => {
            return {
              book_data: JSON.parse(s.book_data),
              control_plan_data: JSON.parse(s.control_plan_data),
              control_plan_number: s.control_plan_number,
              created_date: s.created_date,
              createdby: s.created_by,
              id: s.id,
              is_active: s.is_active,
              part_number: s.part_number,
              plant: s.plant
            }
          });
          this.enableNotification_success = true;
          this.isLoading = false;
        }
        else {
          this.Message = resultData.message;
          this.isError = true;
          this.isLoading = false;
             this.enableNotification_success = false;
        }
      }
    });
  }
  Refresh(): void {
    localStorage.removeItem(LocalStorageConstant.MatrixDetails);
    this.getMatrixDetails();
  }
  applyFilter() {
    const filter_part_number = this.filterForm.get("part_number")?.value;
    if (filter_part_number != null && filter_part_number != undefined && filter_part_number != "") {
      this.filter_part_number = filter_part_number;
      localStorage.setItem(LocalStorageConstant.MatrixSearch, this.filter_part_number);
    }
    this.matrixDetails = JSON.parse(localStorage.getItem(LocalStorageConstant.MatrixDetails) ?? "").filter((s: Matrix) => (s.part_number?.toString().toLowerCase() == this.filter_part_number?.toString().toLowerCase() || this.filter_part_number == ""));
    this.matrixViewDataDetails = this.matrixDetails.map((s) => {
      return {
        book_data: JSON.parse(s.book_data),
        control_plan_data: JSON.parse(s.control_plan_data),
        control_plan_number: s.control_plan_number,
        created_date: s.created_date,
        createdby: s.created_by,
        id: s.id,
        is_active: s.is_active,
        part_number: s.part_number,
        plant: s.plant
      }
    });
  }
  removeFilter(item: string): void {
    if (item == "partnumber") {
      this.filter_part_number = "";
      this.filterForm.get("part_number")?.reset();
      localStorage.removeItem(LocalStorageConstant.MatrixSearch);
    }
    this.applyFilter();
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
}