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
@Component({
  selector: 'app-part-matrix',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HeaderComponent, CommonModule, NgxPaginationModule, LoaderComponent, AlertsComponent, AppComponent],
  templateUrl: './part-matrix.component.html',
  styleUrl: './part-matrix.component.css'
})
export class PartMatrixComponent implements OnInit {
  constructor(private appService: ScriptService) { }
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
  ngOnInit(): void {
    this.getPartDetails();
    this.partsMatrixForm = new FormGroup({
      part_number: new FormControl('', [Validators.required]),
      row_number: new FormControl('', Validators.required),
      column_number: new FormControl('', Validators.required)
    });
  }
  getPartDetails(): void {
    this.isLoading = true;
    if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) && localStorage.getItem(LocalStorageConstant.partMatrixDetail) != undefined) {
      if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) != null) {
        this.partMatrixDetail = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
      }
      this.isLoading = false;
    }
    else {
      this.appService.post(methodConstant.PartMatrixDetail, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            localStorage.setItem(LocalStorageConstant.partMatrixDetail, JSON.stringify(resultData.resultJson));
            this.partMatrixDetail = resultData.resultJson;
            if(this.partMatrixDetail !== null && this.partMatrixDetail.length <= 0){
              this.isEmptyGrid = true;
            }
            else{
              this.isEmptyGrid  = false;
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
  saveDetail(): void {
    if (this.partsMatrixForm.valid) {
      this.isLoading = true;
      if (this.btnLabel === "Update") {
        this.UpdateDetails();
      }
      else {
        this.SaveConfirm();
      }
    }
    else {
      this.partsMatrixForm.markAllAsTouched();
    }
  }
  resetForm(): void {
    this.partsMatrixForm.reset();
  }
  SaveConfirm(): void {
    if (this.validateDatatoSave()) {
      this.appService.post(methodConstant.AddPatrsMatrix, {
        part_number: this.partsMatrixForm.get("part_number")?.value,
        row_number: this.partsMatrixForm.get("row_number")?.value,
        column_number: this.partsMatrixForm.get("column_number")?.value
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            this.isError = false;
            var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
            existing_Json = existing_Json.concat(resultData.resultJson);
            this.partMatrixDetail = existing_Json;
            if (existing_Json != null && existing_Json != "") {
              localStorage.setItem(LocalStorageConstant.partMatrixDetail, JSON.stringify(existing_Json));
            }
            this.isLoading = false;
          }
          else {
            this.Message = resultData.message;
            this.isError = true;
            this.isLoading = false;
            this.partsMatrixForm.reset();
          }
        }
      });
    }
    else{ 
      this.isLoading=false;
    }
  }
  UpdateDetails(): void {
    this.appService.post(methodConstant.UpdatePatrsMatrix, {
      id: this.id,
      part_number: this.partsMatrixForm.get("part_number")?.value,
      row_number: this.partsMatrixForm.get("row_number")?.value,
      column_number: this.partsMatrixForm.get("column_number")?.value,
      created_date: this.created_date,
      created_by: this.created_by,
      is_active: 1
    }).subscribe(result => {
      if (result) {
        const resultData: any = result;
        if (resultData.status == 'Success') {
          this.isError = false;
          var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
          var index = existing_Json.findIndex((obj: { id: string; }) => obj.id === resultData.resultJson.id);
          if (index !== -1) {
            existing_Json[index] = resultData.resultJson;
          }
          this.partMatrixDetail = existing_Json;
          localStorage.setItem(LocalStorageConstant.partMatrixDetail, JSON.stringify(existing_Json));
          this.isLoading = false;
        }
        else {
          this.Message = resultData.message;
          this.isError = true;
          this.isLoading = false;
          this.partsMatrixForm.reset();
        }
      }
    });
  }
  Delete(): void {
    this.isLoading = true;
    this.appService.post(methodConstant.UpdatePatrsMatrix, {
      id: this.id,
      part_number: this.partsMatrixForm.get("part_number")?.value,
      row_number: this.partsMatrixForm.get("row_number")?.value,
      column_number: this.partsMatrixForm.get("column_number")?.value,
      created_date: this.created_date,
      created_by: this.created_by,
      is_active: 0
    }).subscribe(result => {
      if (result) {
        const resultData: any = result;
        if (resultData.status == 'Success') {
          this.isError = false;
          var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
          existing_Json = existing_Json.filter((s: { id: string; }) => s.id !== resultData.resultJson.id);
          this.partMatrixDetail = existing_Json;
          localStorage.setItem(LocalStorageConstant.partMatrixDetail, JSON.stringify(existing_Json));
          this.isLoading = false;
        }
        else {
          this.Message = resultData.message;
          this.isError = true;
          this.isLoading = false;
          this.partsMatrixForm.reset();
        }
      }
    });
  }
  Refresh(): void {
    localStorage.removeItem(LocalStorageConstant.partMatrixDetail);
    this.getPartDetails();
  }
  filteredParts(): PartsMatrix[] {
    if (this.part_number_search !== '') {
      return this.partMatrixDetail.filter(part =>
        String(part.part_number).includes(this.part_number_search)
      );
    }
    else {
      return this.partMatrixDetail;
    }
  }
  validateDatatoSave(): boolean {
    var isValid = false;
    const part_number = this.partsMatrixForm.get("part_number")?.value;
    const row_number = this.partsMatrixForm.get("row_number")?.value;
    const column_number = this.partsMatrixForm.get("column_number")?.value;
    if (this.partMatrixDetail.filter(s => s.part_number === part_number).length > 0) {
      isValid =  false;
      this.isError = true;
      this.Message = "Sorry, Part Number already exists!";
    }
    else if(this.partMatrixDetail.filter(s => s.row_number === row_number && s.column_number === column_number).length > 0){
      isValid =  false;
      this.isError = true;
      this.Message = "Sorry, Row and Column Number combination already exists!";
    }
    else{
      this.isError = false;
      isValid = true;
      this.Message = "";
    }
    return isValid;
  }
}