import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { PartsMatrix } from '../models/partsMatrix';
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
@Component({
  selector: 'app-parts-matrix-search',
  standalone: true,
  providers: [CommonUtilities],
  imports: [NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule],
  templateUrl: './parts-matrix-search.component.html',
  styleUrl: './parts-matrix-search.component.css'
})
export class PartsMatrixSearchComponent implements OnInit {
  isEmptyGrid: boolean = false;
  isLoading: boolean = false;
  Message = "";
  isError: boolean = false;
  row_Number: string = "";
  column_Number: string = "";
  isFound = false;
  foundMessage = "";
  constructor(private commonUtilities: CommonUtilities, private appService: ScriptService) { }
  partsMatrixData: PartsMatrix[] = [];
  ngOnInit(): void {
    this.getPartMatrixData();
  }
  getPartMatrixData(): void {
    this.partsMatrixData = this.commonUtilities.getPartsMatrixDetailFromLocalStorage();
    if (this.partsMatrixData != null && this.partsMatrixData != undefined && this.partsMatrixData.length > 0) {

    }
    else {
      this.isLoading = true;
      this.appService.post(methodConstant.PartMatrixDetail, {
      }).subscribe(result => {
        if (result) {
          const resultData: any = result;
          if (resultData.status == 'Success') {
            localStorage.setItem(LocalStorageConstant.partMatrixDetail, JSON.stringify(resultData.resultJson));
            this.partsMatrixData = resultData.resultJson;
            if (this.partsMatrixData !== null && this.partsMatrixData.length <= 0) {
              this.isEmptyGrid = true;
            }
            else {
              this.isEmptyGrid = false;
            }
            this.isLoading = false;
            this.isError = false;
            this.Message = "";
          }
          else {
            this.isError = true;
            this.Message = resultData.message;
            this.isLoading = false;
          }
        }
      });
    }
  }
  partsSearch(event: any): void {
    if (event != null && event !== undefined) {
      const selected_part = event.part_number;
      this.isFound = false;
      this.foundMessage = "Results not found for the part number " + selected_part;
      if (selected_part != null && selected_part != undefined) {
        this.partsMatrixData.map(s => {
          if (s.part_number === selected_part) {
            this.row_Number = s.row_number;
            this.column_Number = s.column_number;
            this.isFound = true;
          }
        });
      }
      else {
        this.row_Number = "";
        this.column_Number = "";
        this.isFound = false;
      }
    }
    else {
      this.row_Number = "";
      this.column_Number = "";
      this.isFound = false;
    }
  }
}
