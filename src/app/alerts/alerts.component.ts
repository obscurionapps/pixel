import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
@Input() successAlert: boolean = false;
@Input() errorAlert: boolean = false;
@Input() matrixAlert: boolean = false;
@Input() Message:string = '';
@Input() RowNumber:string = '';
@Input() ColumnNumber:string='';
}