import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent  implements OnInit{
ngOnInit(): void {
  setTimeout(() => {
    this.successAlert = false;
    this.errorAlert=false;
  }, 5000);
}
@Input() successAlert: boolean = false;
@Input() errorAlert: boolean = false;
@Input() matrixAlert: boolean = false;
@Input() Message:string = '';
@Input() RowNumber:string = '';
@Input() ColumnNumber:string='';
}