import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notification',
  standalone: true,
  providers: [CommonModule],
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent { 
  @Input() successNotificationEnabled: boolean = false;
  @Input() failureNotificationEnabled: boolean = false;
  removeAlert(): void {    
    this.successNotificationEnabled = false;
    this.failureNotificationEnabled = false;
  }
}
