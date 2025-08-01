declare var bootstrap: any;
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonUtilities } from '../common/CommonUtilities';
import { ActualValue, partSpecification } from '../models/PartSpecDetail';
import { ScriptService } from '../service/appscript.service';
import { LocalStorageConstant, methodConstant } from '../common/constants';
import { LoaderComponent } from '../loader/loader.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from '../models/Custom';
import { ReportedIssues } from '../models/reportedIssue';
import { NotificationComponent } from '../notification/notification.component';
import { LightboxModule } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';
@Component({
  selector: 'app-reportissue',
  standalone: true,
  providers: [CommonUtilities],
  imports: [LightboxModule, ReactiveFormsModule, NgxPaginationModule, NgSelectModule, AlertsComponent, LoaderComponent, FormsModule, HeaderComponent, CommonModule, NgbModule, NotificationComponent],
  templateUrl: './reportissue.component.html',
  styleUrl: './reportissue.component.css'
})
export class ReportissueComponent implements OnInit {
  constructor(private _lightbox: Lightbox, private commonUtilities: CommonUtilities, private appService: ScriptService, private router: Router, private route: ActivatedRoute) { }
  @ViewChild('closeBtnSpecModal') closeModalBtn!: ElementRef;
  isOverlayOpen = false;
  zoomLevel = 1;
  isLoading = false;
  isEmptyGrid = false;
  reportForm!: FormGroup;
  loginRole: string = "";
  issue_id_QueryString = "";
  formattedDate = "";
  specSubForm!:FormGroup;
  selectedSpec: partSpecification = {
    actualValue: [],
    specification: '',
    id: ''
  };
  actualValueForSpec:ActualValue[]=[];
  actionForm !: FormGroup;
  btnLabel="Save";
  Message = "";
  specificationItems: partSpecification[] = [];
  isSpecError=false;
  actionItems:Actions[]=[];
  selectedAction:Actions = {
    id:'',
    action:''
  };
  fileName : string | ArrayBuffer | null = null;
  isActionError = false;
  btnActionLabel= "Save";
  fileSizeError = false;
  issueTypes = [{ "name": "NA", "value": "" }, { "value": "customer_reported", "name": "Customer Reported" },
  { "name": "Improvement", "value": "improvment" }
  ];
  resolvedItems = [{ "name": "No", "value": "no" }, { "value": "yes", "name": "Yes" }];
  
  previewFullViewImage:string|ArrayBuffer|null = null;
  defect_image:string|ArrayBuffer|null = null;
  btnMainSaveText = "Save";
  actual_values_array:ActualValue[]=[];
  
  enableNotification_success=false;
  enableNotification_failure=false;
  ngOnInit(): void {
    if (!this.commonUtilities.isAccessEnabled())
      this.router.navigate(['login']);    
    this.loginRole = this.commonUtilities.getRole();
    this.reportForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      part_number: new FormControl('', Validators.required),
      control_plan_no: new FormControl('', Validators.required),
      drawing_number: new FormControl('', Validators.required),
      issue_type: new FormControl(''),
      problem: new FormControl('', Validators.required),
      imapct: new FormControl(''),
      remarks: new FormControl(''),
      is_resolved: new FormControl('')
    });
     this.specSubForm = new FormGroup({
      specification: new FormControl('', [Validators.required])
    });
      this.actionForm = new FormGroup({
      action: new FormControl('', [Validators.required])
    });
    this.route.queryParams.subscribe(params => {
      this.issue_id_QueryString = params['id'];
    });
    if(this.issue_id_QueryString != null && this.issue_id_QueryString != "" && this.issue_id_QueryString.length > 0){
      this.loadIssueDetail();
      this.btnMainSaveText = "Update";
    }
  }
  onDateSelected(date: NgbDateStruct) {
    this.formattedDate = `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
    this.formattedDate.replaceAll('/','$');
  }

  loadIssueDetail():void
  {
    const issueDeatiledData : ReportedIssues[] = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssues) ?? "").filter(
      (s:ReportedIssues)=>s.id == this.issue_id_QueryString
    );
    if (issueDeatiledData != null && issueDeatiledData != undefined) {
      this.actionItems = JSON.parse(issueDeatiledData[0].actions);
      this.specificationItems = JSON.parse(issueDeatiledData[0].specification);
      const [day, month, year] = issueDeatiledData[0].date.split('/').map(Number);
      const ngbDate: NgbDateStruct = { day, month, year };
      this.reportForm.get('date')?.setValue(ngbDate);
      this.reportForm.get("part_number")?.patchValue(issueDeatiledData[0].part_number);
      this.reportForm.get("control_plan_no")?.patchValue(issueDeatiledData[0].control_plan_no);
      this.reportForm.get("drawing_number")?.patchValue(issueDeatiledData[0].drawing_number);
      this.reportForm.get("issue_type")?.patchValue(issueDeatiledData[0].issue_type);
      this.reportForm.get("problem")?.patchValue(issueDeatiledData[0].problem);
      this.reportForm.get("imapct")?.patchValue(issueDeatiledData[0].imapct);
      this.reportForm.get("remarks")?.patchValue(issueDeatiledData[0].remarks);
      this.reportForm.get("is_resolved")?.patchValue(issueDeatiledData[0].is_resolved);
      this.defect_image  = issueDeatiledData[0].defect_image;
    }
    setTimeout(() => {
      this.onDateSelected( this.reportForm.get('date')?.value);
    }, 1);
  }
    addSpecificationDetail(): void {
    var spec = new partSpecification();
    spec.specification = this.specSubForm.get("specification")?.value;
    spec.actualValue = this.actual_values_array;
      if (this.specSubForm.valid && this.validateActualValue()) {
        this.closeModalBtn.nativeElement.click();
        if (this.btnLabel === "Save") {
          spec.id = this.commonUtilities.generateGUID();
          if (this.specificationItems.filter(s => s.specification === spec.specification).length > 0) {
            this.isSpecError = true;
            this.Message = "Specification is already exists";
          } else {
            this.specificationItems.push(spec);
            this.isSpecError = false;
            this.Message = "";
          }
        }
        else {
          if (this.selectedSpec.id != "") {
            this.isSpecError = false;
            this.Message = "";
            this.specificationItems.map(s => {
              if (s.id === this.selectedSpec.id) {
                s.actualValue = spec.actualValue;
                s.specification = spec.specification;
              }
            })
          }
        }
        this.specSubForm.reset();
      }
      else{
        this.specSubForm.markAsUntouched();
      }
  }
   openModal(spec: partSpecification | null) {
      if (spec != null) {
        this.btnLabel = 'Update';
        this.selectedSpec = {
          specification: spec.specification,
          actualValue: spec.actualValue,
          id: spec.id
        }
        this.actual_values_array = spec.actualValue;
      }
      else {
        this.selectedSpec = {
          specification: '',
          actualValue: [], 
          id: ''
        }
        this.btnLabel = 'Save';
        this.actual_values_array = [];
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
    deleteSpec(spec:partSpecification):void{
      if(spec !=null && spec != undefined){
        this.specificationItems = this.specificationItems.filter(s=>s.id !== spec.id);
      }
    }

  addActions(): void {
    var action = new Actions();
    if (this.actionForm.valid) {
      action.action = this.actionForm.get("action")?.value;
      if (this.btnActionLabel === "Save") {
        action.id = this.commonUtilities.generateGUID();
        if (this.actionItems.filter(s => s.action === action.action).length > 0) {
          this.isActionError = true;
          this.Message = "Action is already exists";
        } else {
          this.actionItems.push(action);
          this.isActionError = false;
          this.Message = "";
        }
      }
      else {
        if (this.selectedAction.id != "") {
          this.isActionError = false;
          this.Message = "";
          this.actionItems.map(s => {
            if (s.id === this.selectedAction.id) {
              s.action = action.action;
            }
          })
        }
      }
      this.actionForm.reset();
    }
    else{
      this.actionForm.markAllAsTouched();
    }
  }
   openActionModal(action: Actions | null) {
      if (action != null) {
        this.btnActionLabel = 'Update';
        this.selectedAction = {
          action: action.action,
          id: action.id
        } 
      }
      else {
        this.selectedAction = {
          action: '', 
          id: ''
        }
        this.btnActionLabel = 'Save';
      }
      const modalElement = document.getElementById('actionModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        modal.show();
      }
    }
    deleteAction(action: Actions | null):void{
      if(action !=null && action != undefined){
        this.actionItems = this.actionItems.filter(s=>s.id !== action.id);
      }
    }
    saveReportIssue():void{
      if (this.reportForm.valid) {
        this.isLoading = true;
        const date = this.formattedDate;
        const part_number = this.reportForm.get("part_number")?.value;
        const control_plan_no = this.reportForm.get("control_plan_no")?.value;
        const drawing_number = this.reportForm.get("drawing_number")?.value;
        const issue_type = this.reportForm.get("issue_type")?.value;
        const problem = this.reportForm.get("problem")?.value;
        const imapct = this.reportForm.get("imapct")?.value;
        const remarks = this.reportForm.get("remarks")?.value;
        const is_resolved = this.reportForm.get("is_resolved")?.value;
        const specification = JSON.stringify(this.specificationItems);
        const actions = JSON.stringify(this.actionItems);
        const methodName = (this.issue_id_QueryString != null && this.issue_id_QueryString != "") ? methodConstant.UpdateReportIssue : methodConstant.AddNewIssue;
        this.appService.post(methodName, {
            id:(this.issue_id_QueryString != null && this.issue_id_QueryString != "") ? this.issue_id_QueryString : '',
            date: date,
            part_number: part_number,
            control_plan_no: control_plan_no,
            drawing_number: drawing_number,
            issue_type: issue_type,
            problem: problem,
            imapct: imapct,
            defect_image: this.defect_image,
            remarks: remarks,
            is_resolved: is_resolved,
            specification: specification,
            actions: actions,
            filename:this.fileName
          }).subscribe(result => {
            if (result) {
              const resultData: any = result;
              if (resultData.status == 'Success') {
                if (methodName == methodConstant.AddNewIssue) {
                  var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssues) ?? "");
                  existing_Json = existing_Json.concat(resultData.resultJson);
                  if (existing_Json != null && existing_Json != "") {
                    localStorage.setItem(LocalStorageConstant.reportedIssues, JSON.stringify(existing_Json));
                    this.router.navigate(['reportissue_grid']);
                    this.enableNotification_success=true;
                  }
                }
                else if(methodName == methodConstant.UpdateReportIssue){
                  var existing_Json = JSON.parse(localStorage.getItem(LocalStorageConstant.reportedIssues) ?? "");
                  var index = existing_Json.findIndex((obj: { id: string; }) => obj.id === resultData.resultJson.id);
                  if (index !== -1) {
                    existing_Json[index] = resultData.resultJson;
                  }
                  if (existing_Json != null && existing_Json != "") {
                    localStorage.setItem(LocalStorageConstant.reportedIssues, JSON.stringify(existing_Json));
                    localStorage.setItem("status", "1");
                    this.router.navigate(['reportissue_grid']);
                  }
                }
                this.isLoading = false;
              }
              else {
                this.Message = resultData.message;
                this.isLoading = false;
                this.reportForm.reset();
                this.enableNotification_success=false;
                this.enableNotification_failure=true;
                localStorage.setItem("status", "0");
                this.router.navigate(['reportissue_grid']);
              }
            }
          });
      }
      else {
        this.reportForm.markAllAsTouched();
      }
    }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateImageFile(file)) {
        const reader = new FileReader();
        this.commonUtilities.getBase64Image(file,(result:string|ArrayBuffer) =>{
          this.fileName = file.name;
          this.defect_image = result;
        });
      }
    }
  }
  removeImagePreview():void{
    this.defect_image  = "";
  }
  validateImageFile(file:File):boolean{
    var isValidfile=false;
    var max_size = 5 * 1024 * 1024;
    if(file != null && file.size <= max_size){
      isValidfile = true;
      this.fileSizeError = false;
      this.Message = "";
    }
    else{
      this.fileSizeError = true;
      this.Message = "Sorry, File size exceeds the limit. File size is allowed only up to 5MB.";
      isValidfile = false;
    }
    return isValidfile;
  }
  viewImage(result:string):void{
    if(result != null){
      this.previewFullViewImage = result; 
    }
  }
  BackToGrid():void{
    this.router.navigate(['reportissue_grid']);
  }
  onAddActualValues():void{
    if(this.validateActualValue()){
      this.actual_values_array.push(new ActualValue('', true));
      this.selectedSpec.actualValue = this.actual_values_array;
    }
  }
  validateActualValue(): boolean {
    if (this.selectedSpec.actualValue.filter(s => s.value == '').length > 0) {
      this.selectedSpec.actualValue.map((s) => {
        if (s.value == '') {
          s.isValid = false;
        } else {
          s.isValid = true;
        }
      });
    }
    else{
      this.selectedSpec.actualValue.map(s=>s.isValid = true);
    }
    return (this.selectedSpec.actualValue.filter(s=>s.isValid == false).length <= 0);
  }
  removeActualValue(i:number):void{
    if(i >= 0){
      this.actual_values_array.splice(i, 1);
    }
  }
  openOverlay() {
    this.isOverlayOpen = true;
    this.zoomLevel = 1;
  } 
  closeOverlay() {
    this.isOverlayOpen = false;
  } 
  zoomIn() {
    this.zoomLevel += 1;
  }
  zoomOut() {
    if (this.zoomLevel > 1) this.zoomLevel -= 1;
  }
}

