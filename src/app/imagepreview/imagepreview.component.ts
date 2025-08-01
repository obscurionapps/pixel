import { Component,Input } from '@angular/core';
import { LightboxModule } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-imagepreview',
  standalone: true,
  providers:[CommonModule],
  imports: [LightboxModule],
  templateUrl: './imagepreview.component.html',
  styleUrl: './imagepreview.component.css'
})
export class ImagepreviewComponent {
@Input() isImagePreview:boolean = false;
@Input() imageUrl:string | ArrayBuffer | null = "";
private _album: Array<any> = [];
constructor(private _lightbox: Lightbox) {
    this._album.push({
      src: this.imageUrl,
      caption: 'Zoomable Image',
      thumb: this.imageUrl
    });
  }
  open(): void {
    this._lightbox.open(this._album, 0);
  }
  close(): void {
    this._lightbox.close();
  }
}
