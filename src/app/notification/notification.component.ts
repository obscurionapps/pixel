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
export class NotificationComponent implements OnInit{
  @Input() successNotificationEnabled: boolean = false;
  @Input() failureNotificationEnabled: boolean = false;
    ngOnInit(): void {
    setTimeout(() => {
      this.removeAlert();
    }, 2000);
  } 
  removeAlert(): void {    
    this.successNotificationEnabled = false;
    this.failureNotificationEnabled = false;
  }
}
