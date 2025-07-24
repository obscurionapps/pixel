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
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-specifications',
  standalone: true,
  providers: [CommonUtilities],
  imports: [ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule],
  templateUrl: './add-specifications.component.html',
  styleUrl: './add-specifications.component.css'
})
export class AddSpecificationsComponent implements OnInit {
  btnLabel: string = 'Save';
  constructor(private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router, private route: ActivatedRoute) { }
  isLoading = false;
  isEmptyGrid = false;
  p: number = 1;
  q: number = 1;
  specificForm!: FormGroup;
  specSubForm!: FormGroup;
  specificationItems: specification[] = [];
  isError = false;
  isMainSaveError = false;
  Message = "";
  partSpecIdQuerystring = "";
  isEnablePartNumber = true;
  selectedSpec: specification = {
    actualValue: '',
    specification: '',
    id: '',
    outputValue: ''
  };
  selectedPartSpecific: PartSpecDetail = {
    control_plan_no: '',
    created_by: '',
    created_date: '',
    drawing_no: '',
    id: '',
    is_active: '',
    issue: '',
    mod_by: '',
    mod_date: '',
    part_number: '',
    remedy: '',
    spec_json: new SpecJSON()
  }
  selectedSpecJson: SpecJSON[] = [];
  loginRole = "";
  isValuecheck = false;
  isCorrectValue = false;
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled())
      this.router.navigate(['login']);
    this.loginRole = this.commonUtilities.getRole();
    this.specificForm = new FormGroup({
      part_number: new FormControl('', [Validators.required]),
      control_plan_no: new FormControl('', Validators.required),
      drawing_no: new FormControl('', Validators.required),
      issue: new FormControl(''),
      remedy: new FormControl('')
    });
    this.specSubForm = new FormGroup({
      specification: new FormControl('', [Validators.required]),
      actual_value: new FormControl(''),
      output_value: new FormControl('')
    });
    this.route.queryParams.subscribe(params => {
      this.partSpecIdQuerystring = params['id'];
    });
    if (this.partSpecIdQuerystring != "" && this.partSpecIdQuerystring != undefined) {
      this.isEnablePartNumber = false;
      this.FillSpecificationData();
    }
    else{
      this.isEnablePartNumber = true;
    }
  }
  FillSpecificationData(): void {
    var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partSpecDetail) ?? "");
    if (existing_Json != null && existing_Json != undefined && existing_Json.length > 0) {
      existing_Json.map((s: any) => {
        if (s.id === this.partSpecIdQuerystring) {
          this.selectedPartSpecific.id = s.id,
            this.selectedPartSpecific.control_plan_no = s.control_plan_no,
            this.selectedPartSpecific.created_by = s.created_by,
            this.selectedPartSpecific.created_date = s.created_date,
            this.selectedPartSpecific.drawing_no = s.drawing_no,
            this.selectedPartSpecific.is_active = "1",
            this.selectedPartSpecific.issue = s.issue,
            this.selectedPartSpecific.part_number = s.part_number,
            this.selectedPartSpecific.remedy = s.remedy,
            this.selectedPartSpecific.mod_by = s.mod_by,
            this.selectedPartSpecific.mod_date = s.mod_date,
            this.selectedSpecJson = JSON.parse(s.spec_json);
        }
      })
    }
    if (this.selectedSpecJson != null && this.selectedSpecJson != undefined && this.selectedSpecJson.length > 0) {
      this.selectedSpecJson.map((s: SpecJSON) => {
        this.selectedPartSpecific.spec_json.specification = s.specification;
        this.selectedPartSpecific.spec_json.actualValue = s.actualValue;
        this.selectedPartSpecific.spec_json.outputValue = s.outputValue;
        this.selectedPartSpecific.spec_json.id = s.id;
        this.specificationItems.push(s);
      })
    }
  }
  openModal(spec: specification | null) {
    if (spec != null) {
      this.btnLabel = 'Update';
      this.selectedSpec = {
        specification: spec.specification,
        actualValue: spec.actualValue,
        outputValue: spec.outputValue,
        id: spec.id
      }
      this.checkValueValidity();
    }
    else {
      this.selectedSpec = {
        specification: '',
        actualValue: '',
        outputValue: '',
        id: ''
      }
      this.btnLabel = 'Save';
    }
    const modalElement = document.getElementById('specModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }
  addSpecification(): void {
    var spec = new specification();
    spec.specification = this.specSubForm.get("specification")?.value;
    spec.actualValue = this.specSubForm.get("actual_value")?.value;
    spec.outputValue = this.specSubForm.get("output_value")?.value;
    if (this.btnLabel === "Save") {
      spec.id = this.commonUtilities.generateGUID();
      if (this.specificationItems.filter(s => s.specification === spec.specification).length > 0) {
        this.isError = true;
        this.Message = "Specification is already exists";
      } else {
        this.specificationItems.push(spec);
        this.isError = false;
        this.Message = "";
      }
    }
    else {
      if (this.selectedSpec.id != "") {
        this.isError = false;
        this.Message = "";
        this.specificationItems.map(s => {
          if (s.id === this.selectedSpec.id) {
            s.actualValue = spec.actualValue;
            s.outputValue = spec.outputValue;
            s.specification = spec.specification;
          }
        })
      }
    }
    this.specSubForm.reset();
  }
  savePartSpecificationDetail(is_active:string = '1'): void {
    if (this.specificForm.valid) {
      if (this.partSpecIdQuerystring != null && this.partSpecIdQuerystring.length > 0) {
        //update
        this.isLoading = true;
        const id = this.partSpecIdQuerystring;
        const part_number = this.specificForm.get("part_number")?.value;
        const control_plan_no = this.specificForm.get("control_plan_no")?.value;
        const drawing_no = this.specificForm.get("drawing_no")?.value;
        const issue = this.specificForm.get("issue")?.value;
        const remedy = this.specificForm.get("remedy")?.value;
        var spec_JsonData = "";
        if (this.specificationItems != null && this.specificationItems.length > 0) {
          spec_JsonData = JSON.stringify(this.specificationItems);
        }
        this.appService.post(methodConstant.UpdatePartSecDetail, {
          id: id,
          part_number: part_number,
          control_plan_no: control_plan_no,
          drawing_no: drawing_no,
          issue: issue,
          spec_json: spec_JsonData,
          remedy: remedy,
          created_by: this.selectedPartSpecific.created_by,
          created_date: this.selectedPartSpecific.created_date,
          mod_by: this.selectedPartSpecific.mod_by,
          mod_date: this.selectedPartSpecific.mod_date,
          is_active: is_active
        }).subscribe(result => {
          if (result) {
            const resultData: any = result;
            if (resultData.status == 'Success') {
              this.isError = false;
              var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partSpecDetail) ?? "");
              var index = existing_Json.findIndex((obj: { id: string; }) => obj.id === resultData.resultJson.id);
              if (index !== -1) {
                if(is_active == "1"){
                  existing_Json[index] = resultData.resultJson;
                }
                else{
                  existing_Json = existing_Json.filter((s:{id:string}) => s.id !== resultData.resultJson.id);
                }
              }
              if (existing_Json != null && existing_Json != "") {
                localStorage.setItem(LocalStorageConstant.partSpecDetail, JSON.stringify(existing_Json));
              }
              this.isLoading = false;
              this.specificForm.reset();
              this.router.navigate(['specdetail']);
            }
            else {
              this.Message = resultData.message;
              this.isMainSaveError = true;
              this.isLoading = false;
              this.specificForm.reset();
            }
          }
        });
      }
      else {
        //save
        const part_number = this.specificForm.get("part_number")?.value;
        const control_plan_no = this.specificForm.get("control_plan_no")?.value;
        const drawing_no = this.specificForm.get("drawing_no")?.value;
        const issue = this.specificForm.get("issue")?.value;
        const remedy = this.specificForm.get("remedy")?.value;
        var spec_JsonData = "";
        if (this.specificationItems != null && this.specificationItems.length > 0) {
          spec_JsonData = JSON.stringify(this.specificationItems);
        }
        if (this.validateSaveData()) {
          this.isLoading = true;
          this.appService.post(methodConstant.AddPartSecDetail, {
            part_number: part_number,
            control_plan_no: control_plan_no,
            drawing_no: drawing_no,
            issue: issue,
            spec_json: spec_JsonData,
            remedy: remedy
          }).subscribe(result => {
            if (result) {
              const resultData: any = result;
              if (resultData.status == 'Success') {
                this.isError = false;
                var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.partSpecDetail) ?? "");
                existing_Json = existing_Json.concat(resultData.resultJson);
                if (existing_Json != null && existing_Json != "") {
                  localStorage.setItem(LocalStorageConstant.partSpecDetail, JSON.stringify(existing_Json));
                }
                this.isLoading = false;
                this.specificForm.reset();
                this.router.navigate(['specdetail']);
              }
              else {
                this.Message = resultData.message;
                this.isMainSaveError = true;
                this.isLoading = false;
                this.specificForm.reset();
              }
            }
          });
        }
      }
    }
    else {
      this.specificForm.markAllAsTouched();
    }
  }
  validateSaveData(): boolean {
    var isValid = false;
    if (localStorage.getItem(LocalStorageConstant.partSpecDetail) != null && localStorage.getItem(LocalStorageConstant.partSpecDetail) != undefined
      && localStorage.getItem(LocalStorageConstant.partSpecDetail)) {
      const jsonSpecs = JSON.parse(localStorage.getItem(LocalStorageConstant.partSpecDetail) ?? "");
      if (jsonSpecs.filter((s: any) => s.part_number == this.specificForm.get("part_number")?.value).length > 0) {
        isValid = false;
        this.isMainSaveError = true;
        this.Message = "Specifications are already added for this part number, Please edit it!";
      }
      else {
        isValid = true;
        this.isMainSaveError = false;
        this.Message = "";
      }
    }
    return isValid;
  }
  cancelToList(): void {
    this.router.navigate(['specdetail']);
  }
  checkValueValidity():void{
    const actual_value = this.specSubForm.get("actual_value")?.value;
    if(this.specSubForm.get("output_value")?.value == undefined || this.specSubForm.get("output_value")?.value == ""){
        this.isValuecheck = false;
        this.Message = "";
        this.isCorrectValue = false;
      }
    else if(actual_value != null && actual_value !== undefined){
      const number_part =  parseInt(actual_value, 10);
      if(number_part != parseInt(this.specSubForm.get("output_value")?.value, 10))
      {
        this.isCorrectValue = false;
        this.isValuecheck = true;
        this.Message = "The Output value is not matching with expected value.";
      }
      else{
        this.isValuecheck = false;
        this.Message = "";
        this.isCorrectValue = true;
        this.Message="The Output value and expected value are matched, you can proceed."
      }
    }
  }
}
