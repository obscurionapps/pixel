import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageConstant, methodConstant } from '../common/constants';

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private scriptUrl_dev = 'https://script.google.com/macros/s/AKfycbwlOV7zxAbE5viOa7gh9tkhzHWdcv-0zQIxzOYz9ndCiqGvGdqtMrJZhyXzktPA3mRp/exec';
    private scriptUrl_prod = 'https://script.google.com/macros/s/AKfycbyHtfUwxCRON7gkXTQapapZtDxyeXzqPDfxE-HbAmrYaacqBYrRMwWcxiKM0vRp7LUN0Q/exec';
    constructor(private http: HttpClient) { }
    getData() {
        return this.http.get(this.scriptUrl_prod);
    }
    post(method: string, payload: any) {
        const body = new URLSearchParams();
        if (method !== methodConstant.Authentication) {
            body.set('access_token', localStorage.getItem(LocalStorageConstant.AccessToken) ?? '');
        }
        body.set('method', method);
        body.set('payload', JSON.stringify({ payload }));
        return this.http.post(this.scriptUrl_prod, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
}