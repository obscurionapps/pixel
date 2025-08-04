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
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookMatrix, ControlPlanMatrix, Matrix } from '../models/Custom';
import { NotificationComponent } from '../notification/notification.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreadCrumb } from '../models/Custom';
@Component({
  selector: 'app-creatematrix',
  standalone: true,
  providers:[CommonUtilities],
  imports: [BreadcrumbComponent, NotificationComponent, ReactiveFormsModule, NgSelectModule, FormsModule, HeaderComponent, CommonModule, NgxPaginationModule, LoaderComponent, AlertsComponent, AppComponent],
  templateUrl: './creatematrix.component.html',
  styleUrl: './creatematrix.component.css'
})
export class CreatematrixComponent implements OnInit {
  constructor(private appService: ScriptService, private commonUtilities:CommonUtilities, private router:Router, private route: ActivatedRoute) { }
    breadcrumb_data:BreadCrumb[]=[{"title":"Dashboard", "route":"/home", "active":false}, {"title":"Part matrix list", "route":"/partmaxtrix", "active":false}
      ,{"title":"Part matrix management", "route":"/manageMatrix", "active":true}
    ];
  matrixForm!:FormGroup;
  isLoading = false;
  plants = [ {"name":"--Select Plant--", "value":""},{"name":"P1", "value":"P1"},{"name" : "P2", "value" : "P2"}];
  btnMainSaveText="Save";
  selectedMatrix:Matrix = {
    book_data:'',
    control_plan_data:'',
    control_plan_number:'',
    created_by:'',
    created_date:'',
    id:'',
    is_active:'',
    part_number:'',
    plant:''
  }
  selectedControlMatrix:ControlPlanMatrix={
    column:'',
    row:''
  }
  selectedBookMatrix:BookMatrix={
    column:'',
    row:''
  }
  Message = "";
  matrixId:string = "";
  enableNotification_success=false;
  enableNotification_failure=false;

  ngOnInit(): void {
    this.matrixForm = new FormGroup({
      part_number: new FormControl('', [Validators.required]),
      plant: new FormControl('', Validators.required),
      control_plan_number: new FormControl(''),
      control_plan_row:new FormControl('', Validators.required),
      control_plan_column:new FormControl('', Validators.required),
      book_row:new FormControl('', Validators.required),
      book_column:new FormControl('', Validators.required)
    });
    this.route.queryParams.subscribe(params => {
      this.matrixId = params['id'];
    });
    if(this.matrixId != null && this.matrixId != undefined && this.matrixId != ""){
      this.btnMainSaveText="Update";
      this.loadSelectedMatrix();
    }
  }
  loadSelectedMatrix():void{
    const matrixData = localStorage.getItem(LocalStorageConstant.MatrixDetails);
    if(matrixData != null && matrixData != undefined && matrixData != ""){
      const matrix_josn = JSON.parse(matrixData);
      this.selectedMatrix = matrix_josn.filter((s:Matrix)=>s.id == this.matrixId)[0];
      const control_plan_row_json : ControlPlanMatrix = JSON.parse(this.selectedMatrix.control_plan_data);
      const book_json:BookMatrix=JSON.parse(this.selectedMatrix.book_data);
      this.matrixForm.get("part_number")?.patchValue(this.selectedMatrix.part_number);
      this.matrixForm.get("plant")?.patchValue(this.selectedMatrix.plant);
      this.matrixForm.get("control_plan_number")?.patchValue(this.selectedMatrix.control_plan_number);
      this.matrixForm.get("control_plan_row")?.patchValue(control_plan_row_json.row);
      this.matrixForm.get("control_plan_column")?.patchValue(control_plan_row_json.column);
      this.matrixForm.get("book_row")?.patchValue(book_json.row);
      this.matrixForm.get("book_column")?.patchValue(book_json.column);
    }
  }
  saveMatrix():void{
    if(this.matrixForm.valid){
      this.isLoading = true;
      const part_number = this.matrixForm.get("part_number")?.value;
      const plant = this.matrixForm.get("plant")?.value;
      const control_plan_number = this.matrixForm.get("control_plan_number")?.value;
      const control_plan_row = this.matrixForm.get("control_plan_row")?.value;
      const control_plan_column = this.matrixForm.get("control_plan_column")?.value;
      const book_row = this.matrixForm.get("book_row")?.value;
      const book_column = this.matrixForm.get("book_column")?.value;
      const control_matrix = new ControlPlanMatrix();
      control_matrix.column = control_plan_column;
      control_matrix.row = control_plan_row;
      const book_matrix = new BookMatrix();
      book_matrix.column = book_column;
      book_matrix.row = book_row;
      const methodName = (this.matrixId != null && this.matrixId != "") ? methodConstant.UpdatePatrsMatrix : methodConstant.AddPatrsMatrix;
        this.appService.post(methodName, {
            id:(this.matrixId != null && this.matrixId != "") ? this.matrixId : '',
            part_number:part_number,
            plant:plant,
            control_plan_number:control_plan_number,
            control_plan_data:JSON.stringify(control_matrix),
            book_data:JSON.stringify(book_matrix),
            is_active:1
          }).subscribe(result => {
            if (result) {
              const resultData: any = result;
              if (resultData.status == 'Success') {
                if (methodName == methodConstant.AddPatrsMatrix) {
                  var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.MatrixDetails) ?? "");
                  existing_Json = existing_Json.concat(resultData.resultJson);
                  if (existing_Json != null && existing_Json != "") {
                    localStorage.setItem(LocalStorageConstant.MatrixDetails, JSON.stringify(existing_Json));
                  }
                }
                else if(methodName == methodConstant.UpdatePatrsMatrix){
                  var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.MatrixDetails) ?? "");
                  var index = existing_Json.findIndex((obj: { id: string; }) => obj.id === resultData.resultJson.id);
                  if (index !== -1) {
                    existing_Json[index] = resultData.resultJson;
                  }
                  if (existing_Json != null && existing_Json != "") {
                    localStorage.setItem(LocalStorageConstant.MatrixDetails, JSON.stringify(existing_Json));
                  }
                }
                this.enableNotification_success=true;
                localStorage.setItem("status", "1");
                this.router.navigate(['partmaxtrix']);
                this.isLoading = false;
              }
              else {
                this.Message = resultData.message;
                this.isLoading = false;
                this.matrixForm.reset();
                this.enableNotification_success=false;
                this.enableNotification_failure=true;
                localStorage.setItem("status", "0");
                this.router.navigate(['partmaxtrix']);
              }
            }
          });
    }
    else{
      this.matrixForm.markAllAsTouched();
    }
  }
  goback():void{
    this.router.navigate(['partmaxtrix']);
  }
}
